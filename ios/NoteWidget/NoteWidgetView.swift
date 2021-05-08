//
//  NoteWidgetView.swift
//  NoteWidgetExtension
//
//  Created by Alex Rich on 2/7/21.
//
import SwiftUI
import WidgetKit

struct NoteWidgetEntryView : View {
  
  @State var isTruncated: Bool = false
  @State var colOneText: String = ""
  @State var colTwoText: String = ""
  
  static let formatter = RelativeDateTimeFormatter()
  
  var entry: Provider.Entry

  @Environment(\.widgetFamily) var family: WidgetFamily
  
  var body: some View {
    ZStack{
      Color(entry.color)
      
      VStack(alignment: .leading) {
        Spacer()
        
        // Title
        if entry.showTitle {
          Text(entry.name)
            .font(.system(size:13))
            .foregroundColor(entry.color.isLight() ? Color.black : Color.white)
            .bold()
        }
        
        // Last Modified
        if entry.showModified {
          // Adding -1 second to make the time always appear in the past
          Text("Updated \(entry.lastModified.addingTimeInterval(TimeInterval(-1)), formatter: Self.formatter)")
            .font(.system(size: 10))
            .foregroundColor(entry.color.isLight() ? Color.black : Color.white)
        }
        
        if entry.showTitle || entry.showModified {
          Spacer()
        }
        
        // Note content
        if entry.twoColumn {
          if (isTruncated) {
            HStack(alignment: .top, spacing: 8) {
              
              makeText(colOneText, bgColor: entry.color)
              Divider().background(entry.color.isLight() ? Color.black : Color.white)
              makeText(colTwoText, bgColor: entry.color)
              
            }
          } else {
            TruncableText(text: makeText(entry.content, bgColor: entry.color)) {
              let size = $1
              if ($0 && colTwoText == "") {
                if let (part1, part2) = partitionText(entry.content, size: size, widgetWidth: getWidgetWidth(family)) {
                  colOneText = part1
                  colTwoText = part2
                  
                  // Only set this if we successfully partitioned the text
                  isTruncated = true
                }
              }
            }
          }
        } else {
          makeText(entry.content, bgColor: entry.color)
        }
        
        Spacer()
        Spacer()
        
      }
      .padding(8)
    }.widgetURL(URL(string:"sharednotes://edit/\(entry.slug)"))
    
  }
}
