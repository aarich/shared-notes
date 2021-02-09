//
//  Provider.swift
//  NoteWidgetExtension
//
//  Created by Alex Rich on 2/7/21.
//

import Foundation


struct IdProvider {
  static func getObject() -> String {
    let result = "";
//     RNCAsyncStorage().multiGet(["allIds"]) { (values) in
//      values?.forEach({ (value) in
//        result += value as! String
//      })
//    }
    return result;
  }
}
