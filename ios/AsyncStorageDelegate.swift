//
//  AsyncStorageDelegate.swift
//  sharednotes
//
//  Created by Alex Rich on 2/7/21.
//

//import Foundation
//import UIKit
//
//struct NoteInfo {
//  var name:String
//  var id:Int
//}

//struct LocalNoteProvider {
//  static func getNotes() -> [NoteInfo] {
//    var result:[NoteInfo] = []
//     RNCAsyncStorage().multiGet(["allIds"]) { (values) in
//      let error = values?[0]
//    
//      if (error != nil) {
//        print(error!)
//        return
//      }
//      
//      let actualValues = values?[1] as? [String]
//      actualValues?.forEach({ (value) in
//          result.append(NoteInfo(name:value, id:0))
//      })
//    }
//    return result
//  }
//}
//
//struct TestTextProvider {
//  
//  static func getText() -> String {
//    var result:String = ""
//    
//    RNCAsyncStorage().multiGet(["text"]) { (values) in
//      let error = values?[0]
//    
//      if (error != nil) {
//        print(error!)
//        return
//      }
//      
//      let actualValues = values?[1] as? [String]
//      actualValues?.forEach({ (value) in
//        result.append(value)
//      })
//    }
//    
//    return result
//  }
//}

//class AsyncDelegate : RNCAsyncStorageDelegate {
//
//  init() {
//    hash=5
//  }
//
//  /*
//   * Returns all keys currently stored. If none, an empty array is returned.
//   * @param block Block to call with result.
//   */
//  func allKeys(_ block: @escaping RNCAsyncStorageResultCallback) {
//    <#code#>
//  }
//
//  func mergeValues(_ values: [String], forKeys keys: [String], completion block: @escaping RNCAsyncStorageResultCallback) {
//    <#code#>
//  }
//
//  func removeAllValues(_ block: @escaping RNCAsyncStorageCompletion) {
//    <#code#>
//  }
//
//  func removeValues(forKeys keys: [String], completion block: @escaping RNCAsyncStorageResultCallback) {
//    <#code#>
//  }
//
//  func setValues(_ values: [String], forKeys keys: [String], completion block: @escaping RNCAsyncStorageResultCallback) {
//    <#code#>
//  }
//
//  func values(forKeys keys: [String], completion block: @escaping RNCAsyncStorageResultCallback) {
//    <#code#>
//  }
//
//  func isEqual(_ object: Any?) -> Bool {
//    <#code#>
//  }
//
//  var hash: Int
//
//  var superclass: AnyClass?
//
//  func `self`() -> Self {
//    <#code#>
//  }
//
//  func perform(_ aSelector: Selector!) -> Unmanaged<AnyObject>! {
//    <#code#>
//  }
//
//  func perform(_ aSelector: Selector!, with object: Any!) -> Unmanaged<AnyObject>! {
//    <#code#>
//  }
//
//  func perform(_ aSelector: Selector!, with object1: Any!, with object2: Any!) -> Unmanaged<AnyObject>! {
//    <#code#>
//  }
//
//  func isProxy() -> Bool {
//    <#code#>
//  }
//
//  func isKind(of aClass: AnyClass) -> Bool {
//    <#code#>
//  }
//
//  func isMember(of aClass: AnyClass) -> Bool {
//    <#code#>
//  }
//
//  func conforms(to aProtocol: Protocol) -> Bool {
//    <#code#>
//  }
//
//  func responds(to aSelector: Selector!) -> Bool {
//    <#code#>
//  }
//
//  var description: String
//
//
//}
