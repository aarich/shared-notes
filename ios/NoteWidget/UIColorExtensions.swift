//
//  UIColorExtensions.swift
//  NoteWidgetExtension
//
//  Created by Alex Rich on 2/9/21.
//

import Foundation
import SwiftUI

extension UIColor {
  public convenience init?(hex: String) {
    let r, g, b: CGFloat
    
    if hex.hasPrefix("#") {
      let start = hex.index(hex.startIndex, offsetBy: 1)
      let hexColor = String(hex[start...])
      
      if hexColor.count == 6 {
        let scanner = Scanner(string: hexColor)
        var hexNumber: UInt64 = 0
        
        if scanner.scanHexInt64(&hexNumber) {
          r = CGFloat((hexNumber & 0xff0000) >> 16) / 255
          g = CGFloat((hexNumber & 0x00ff00) >> 8) / 255
          b = CGFloat((hexNumber & 0x0000ff)) / 255
          
          self.init(red: r, green: g, blue: b, alpha: 1)
          return
        }
      }
    }
    
    
    return nil
  }
  
  var redValue: CGFloat{ return CIColor(color: self).red }
  var greenValue: CGFloat{ return CIColor(color: self).green }
  var blueValue: CGFloat{ return CIColor(color: self).blue }
  
  func isLight() -> Bool {
    let threshold:Float = 0.7
    let originalCGColor = self.cgColor
    
    // Now we need to convert it to the RGB colorspace. UIColor.white / UIColor.black are greyscale and not RGB.
    // If you don't do this then you will crash when accessing components index 2 below when evaluating greyscale colors.
    let RGBCGColor = originalCGColor.converted(to: CGColorSpaceCreateDeviceRGB(), intent: .defaultIntent, options: nil)
    guard let components = RGBCGColor?.components else {
      return false
    }
    guard components.count >= 3 else {
      return false
    }
    
    let brightness = Float(((components[0] * 299) + (components[1] * 587) + (components[2] * 114)) / 1000)
    return (brightness > threshold)
  }
}
