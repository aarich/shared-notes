//
//  NoteWidgetView.swift
//  NoteWidgetExtension
//
//  Created by Alex Rich on 2/7/21.
//

import Foundation
import SwiftUI

struct NoteWidgetEntryView : View {
  var entry: Provider.Entry
  
  var body: some View {
    ZStack{
      Color(entry.color)
      VStack(alignment: .leading) {
        if (entry.showTitle) {
          Text(entry.name)
            .font(.system(size:13))
            .bold()
        }
        if (entry.showModified) {
          Text(entry.lastModified, style: .relative)
            .font(.system(size: 12))
        }
        
        Text(entry.content)
          .font(.system(size:12))        
      }
      .padding(.all)
    }
    
  }
}
