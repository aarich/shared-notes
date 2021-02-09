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
            .bold()
        }
        if (entry.showModified) {
          Text("Modified \(entry.lastModified, formatter: Self.formatter)")
            .font(.system(size: 10))
        }
        if (entry.showTitle || entry.showModified) {
          Spacer()
        }
        
        Text(entry.content)
          .font(.system(size:12))
        
        Spacer()
        Spacer()

      }
      .padding(15)
    }
    
  }
}
