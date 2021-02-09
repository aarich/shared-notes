  //
  //  IntentHandler.swift
  //  NoteIntent
  //
  //  Created by Alex Rich on 2/8/21.
  //
  
  import Intents
  
  class IntentHandler: INExtension {
    
    override func handler(for intent: INIntent) -> Any {
      // This is the default implementation.  If you want different objects to handle different intents,
      // you can override this and return the handler you want for that particular intent.
      
      return self
    }
  }
  
  struct AppSettings: Decodable {
    var color:String
    var showTitle:Bool
    var showLastModified:Bool
  }
  
  struct AppData :Decodable {
    var slugs:[String]
    var names:[String]
    var settings:AppSettings
  }
  
  func getAppData() -> AppData? {
    let sharedDefaults = UserDefaults.init(suiteName: "group.com.mrarich.SharedNotes")

    if (sharedDefaults != nil) {
      do{
        let shared = sharedDefaults?.string(forKey: "noteData")
        if(shared != nil){
          let data = try JSONDecoder().decode(AppData.self, from: shared!.data(using: .utf8)!)
          return AppData(slugs: data.slugs, names: data.names, settings: data.settings)
        } else {
          print("xxx No shared data found")
        }
      }catch{
        print("xxx error: ", error)
      }
    } else {
      print("xxx shared defaults not present")
    }
    
    return nil
  }
  
  extension IntentHandler: SelectNoteIntentHandling {
    func provideNoteOptionsCollection(for intent: SelectNoteIntent, with completion: @escaping (INObjectCollection<NoteINO>?, Error?) -> Void) {
      var items: [NoteINO] = []
      
      var slugs :[String] = []
      var names :[String] = []
      
      let data = getAppData()
      
      if (data != nil) {
        print("xxx got stuff")
        slugs = data!.slugs
        names = data!.names
      }
      
      for i in 0..<slugs.count {
        items.append(NoteINO(identifier: slugs[i], display: names[i]))
      }
      
      completion(INObjectCollection(items: items), nil);
    }
    
  }
