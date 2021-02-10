//
//  NoteWidgetView.swift
//  NoteWidgetExtension
//
//  Created by Alex Rich on 2/7/21.
//

import Foundation
import SwiftUI

struct NoteWidgetEntryView : View {
  
  static let formatter = RelativeDateTimeFormatter()

  var entry: Provider.Entry
  
  var body: some View {
    ZStack{
      
      Color(entry.color)
      
      VStack(alignment: .leading) {
        Spacer()

        if (entry.showTitle) {
          Text(entry.name)
            .font(.system(size:13))
            .foregroundColor(entry.color.isLight() ? Color.black : Color.white)
            .bold()
        }
        if (entry.showModified) {
          // Adding -1 second to make it the time always appear in the past.
          Text("Updated \(entry.lastModified.addingTimeInterval(TimeInterval(-1)), formatter: Self.formatter)")
            .font(.system(size: 10))
            .foregroundColor(entry.color.isLight() ? Color.black : Color.white)
        }
        if (entry.showTitle || entry.showModified) {
          Spacer()
        }
        
        Text(entry.content)
          .font(.system(size:12))
          .foregroundColor(entry.color.isLight() ? Color.black : Color.white)

        
        Spacer()
        Spacer()

      }
      .padding(10)
    }.widgetURL(URL(string:"sharednotes://edit/\(entry.slug)"))
    
  }
}
