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
}

struct SimpleEntry: TimelineEntry {
  var date: Date
  let name:String
  let content:String
  let lastModified:Date
  let color:UIColor
  let showTitle:Bool
  let showModified:Bool
  let slug:String
}

@main
struct NoteWidget: Widget {
  let kind: String = "NoteWidget"
  
  var body: some WidgetConfiguration {
    IntentConfiguration(kind: kind, intent: SelectNoteIntent.self, provider: Provider()) { entry in
      NoteWidgetEntryView(entry: entry)
    }
    .configurationDisplayName("Shared Note")
    .description("View your note here! Configure in the app.")
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
  return makeEntry(name: title, content: content, lastModified: Date(), slug:"")
}

func makeEntry(name: String, content: String, lastModified: Date, slug:String) -> SimpleEntry {
  
  let appData = getAppData()
  
  var color = UIColor(red: 0.09, green: 0.63, blue: 0.52, alpha: 1)
  var showTitle = true;
  var showModified = false;

  
  if (appData != nil) {
    color = UIColor(hex: appData!.settings.color)!
    showTitle = appData!.settings.showTitle
    showModified = appData!.settings.showLastModified
  }
  
  return SimpleEntry(date: Date(), name:name, content: content, lastModified: lastModified, color: color, showTitle: showTitle, showModified: showModified, slug: slug)
}

