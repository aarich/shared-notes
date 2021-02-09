//
//  NoteWidget.swift
//  NoteWidget
//
//  Created by Alex Rich on 2/7/21.
//

import WidgetKit
import SwiftUI
import Intents

struct Provider: IntentTimelineProvider {
  func placeholder(in context: Context) -> SimpleEntry {
    return makePreview()
  }
  
  func getSnapshot(for configuration: SelectNoteIntent, in context: Context, completion: @escaping (SimpleEntry) -> ()) {
    lookupNoteDetails(for: configuration, completion:completion)
  }
  
  func getTimeline(for configuration: SelectNoteIntent, in context: Context, completion: @escaping (Timeline<SimpleEntry>) -> ()) {
    
    lookupNoteDetails(for: configuration) { (entry) in
      // Wait 10 minutes before next fetch
      let nextFetch = Date().addingTimeInterval(TimeInterval(20/*60*10*/))
      let timeline = Timeline(entries: [entry], policy: .after(nextFetch))
      completion(timeline)
    }
  }

  private func lookupNoteDetails(for configuration: SelectNoteIntent, completion: @escaping (SimpleEntry) -> ()) -> Void {
    let slug = configuration.note?.identifier
    
    if (slug == nil) {
      print("xxx slug was nil")
      completion(makeEntry(title: "Your Note Here!", content: "Tap here to create a note, then press and hold here and select \"Edit Widget\""))
      return
    }
    
    let endpoint: String = "https://projects.mrarich.com/notes/api/note?slug=" + slug!
    let url = URL(string: endpoint)!
    let task = URLSession.shared.dataTask(with: url) {(data, response, error) in
      guard let data = data else { return }
      print(String(data: data, encoding: .utf8)!)
      
      var name:String
      var modified:String
      var content:String
      
      let json = try? JSONSerialization.jsonObject(with: data, options: [])
      if let dictionary = json as? [String: Any] {
        if (!(dictionary["success"] as! Bool)) {
          let message = dictionary["message"] as? String
          if (message != nil) {
            completion(makeEntry(from: message!))
          } else {
            completion(makeEntry(from: "Success was false and message was not present"))
          }
          return
        }
        
        if let note = dictionary["note"] as? [String: Any] {
          name = note["name"] as! String
          modified=note["modified"] as! String
          content = note["content"] as! String
        } else {
          completion(makeEntry(from: "Couldn't find note"))
          return
        }
      } else {
        completion(makeEntry(from: "couldn't deserialize"))
        return
      }
      
      let dateFormatter = DateFormatter()
      dateFormatter.locale = Locale(identifier: "en_US_POSIX") // set locale to reliable US_POSIX
      dateFormatter.dateFormat = "yyyy-MM-dd HH:mm:ss"
      let date = dateFormatter.date(from:modified)!
      
      completion(makeEntry(name: name, content: content, lastModified: date))
      return
    }
    task.resume()
  }
}

struct NoteResponse {
  let name:String
  let modified:String
  let content:String
  let created:String
}

struct GetResponse {
  let success:Bool
  let note:NoteResponse?
  let message:String?
}

struct SimpleEntry: TimelineEntry {
  var date: Date
  let name:String
  let content:String
  let lastModified:Date
  let color:UIColor
  let showTitle:Bool
  let showModified:Bool
}

@main
struct NoteWidget: Widget {
  let kind: String = "NoteWidget"
  
  var body: some WidgetConfiguration {
    IntentConfiguration(kind: kind, intent: SelectNoteIntent.self, provider: Provider()) { entry in
      NoteWidgetEntryView(entry: entry)
    }
    .configurationDisplayName("Shared Note")
    .description("View your note here!")
  }
}

struct NoteWidget_Previews: PreviewProvider {
  static var previews: some View {
    NoteWidgetEntryView(entry: makePreview())
      .previewContext(WidgetPreviewContext(family: .systemSmall))
  }
}

func makePreview() -> SimpleEntry {
  return makeEntry(title: "Note Title", content: "Note Content")
}

func makeEntry(from error: String) -> SimpleEntry {
  return makeEntry(title: "Error Loading", content: error)
}

func makeEntry(title: String, content:String) -> SimpleEntry {
  return makeEntry(name: "Error Loading", content: content, lastModified: Date())
}

func makeEntry(name: String, content: String, lastModified: Date) -> SimpleEntry {
  
  let appData = getAppData()
  
  var color = UIColor(red: 0.09, green: 0.63, blue: 0.52, alpha: 1)
  var showTitle = true;
  var showModified = false;
  
  if (appData != nil) {
    color = UIColor(hex: appData!.settings.color)!
    showTitle = appData!.settings.showTitle
    showModified = appData!.settings.showLastModified
  }
  
  return SimpleEntry(date: Date(), name:name, content: content, lastModified: lastModified, color: color, showTitle: showTitle, showModified: showModified)
}

extension UIColor {
    public convenience init?(hex: String) {
        let r, g, b: CGFloat

        if hex.hasPrefix("#") {
            let start = hex.index(hex.startIndex, offsetBy: 1)
            let hexColor = String(hex[start...])

            if hexColor.count == 6 {
                let scanner = Scanner(string: hexColor)
                var hexNumber: UInt64 = 0

                if scanner.scanHexInt64(&hexNumber) {
                    r = CGFloat((hexNumber & 0xff0000) >> 16) / 255
                    g = CGFloat((hexNumber & 0x00ff00) >> 8) / 255
                    b = CGFloat((hexNumber & 0x0000ff)) / 255

                    self.init(red: r, green: g, blue: b, alpha: 1)
                    return
                }
            }
        }

    
        return nil
    }
}
