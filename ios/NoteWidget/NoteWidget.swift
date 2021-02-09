//
//  NoteWidget.swift
//  NoteWidget
//
//  Created by Alex Rich on 2/7/21.
//

import WidgetKit
import SwiftUI
import Intents

struct AppData :Decodable {
  var ids:[String]
}

struct Provider: IntentTimelineProvider {
  func placeholder(in context: Context) -> SimpleEntry {
    SimpleEntry(date: Date(),name:"Name", content: "CONTENT", configuration: ConfigurationIntent())
  }
  
  func getSnapshot(for configuration: ConfigurationIntent, in context: Context, completion: @escaping (SimpleEntry) -> ()) {
    let entry = SimpleEntry(date:Date(),name:"Name", content: "CONTENT", configuration: configuration)
    completion(entry)
  }
  
  func getTimeline(for configuration: ConfigurationIntent, in context: Context, completion: @escaping (Timeline<SimpleEntry>) -> ()) {
    var entries: [SimpleEntry] = []
    
    let sharedDefaults = UserDefaults.init(suiteName: "group.com.mrarich.SharedNotes")
    var ids :[String] = ["DATA NOT FOUND"];
    if (sharedDefaults != nil) {
      do{
        let shared = sharedDefaults?.string(forKey: "data")
        if(shared != nil){
          let data = try JSONDecoder().decode(AppData.self, from: shared!.data(using: .utf8)!)
          ids = data.ids
        } else {
          ids = ["Key not found"]
        }
      }catch{
        print(error)
        ids = ["Got eerror"]
      }
    } else {
      ids = ["shared defaults not present"]
    }
    
    // Generate a timeline consisting of five entries an hour apart, starting from the current date.
    let currentDate = Date()
    for hourOffset in 0 ..< 5 {
      let entryDate = Calendar.current.date(byAdding: .hour, value: hourOffset, to: currentDate)!
      let entry = SimpleEntry(date:entryDate, name: "Note Name", content:ids[0], configuration: configuration)
      entries.append(entry)
    }
    
    let timeline = Timeline(entries: entries, policy: .atEnd)
    completion(timeline)
  }
}

struct SimpleEntry: TimelineEntry {
  let date:Date
  let name:String
  let content:String
  let configuration: ConfigurationIntent
}

@main
struct NoteWidget: Widget {
  let kind: String = "NoteWidget"
  
  var body: some WidgetConfiguration {
    IntentConfiguration(kind: kind, intent: ConfigurationIntent.self, provider: Provider()) { entry in
      NoteWidgetEntryView(entry: entry)
    }
    .configurationDisplayName("My Widget")
    .description("This is an example widget.")
  }
}

struct NoteWidget_Previews: PreviewProvider {
  static var previews: some View {
    NoteWidgetEntryView(entry: SimpleEntry(date: Date(), name:"NAME", content: "CONTENT", configuration: ConfigurationIntent()))
      .previewContext(WidgetPreviewContext(family: .systemSmall))
  }
}
