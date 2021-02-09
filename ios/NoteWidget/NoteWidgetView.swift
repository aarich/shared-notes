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
  
  let text = "Some Text"//KeyProvider.getKey()


    var body: some View {
      ZStack{
        Color(red: 0.09, green: 0.63, blue: 0.52)
          VStack(alignment: .leading) {
            Spacer()
            
            Text(text)
            .font(.system(size:10))
            .bold()
            
            Text(entry.content)
            .font(.system(size:10))
            Spacer()
          
          }
          .padding(.all)
      }
        
    }
}
