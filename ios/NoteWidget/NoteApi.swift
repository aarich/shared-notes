//
//  NoteFetcher.swift
//  NoteWidgetExtension
//
//  Created by Alex Rich on 2/9/21.
//

import Foundation

func lookupNoteDetails(for configuration: SelectNoteIntent, completion: @escaping (SimpleEntry) -> ()) -> Void {
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
    
    completion(makeEntry(name: name, content: content, lastModified: date, slug: slug!))
    return
  }
  task.resume()
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
