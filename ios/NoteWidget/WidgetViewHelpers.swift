//
//  File.swift
//  NoteWidgetExtension
//
//  Created by Alex Rich on 5/7/21.
//
import SwiftUI
import WidgetKit

struct SizePreferenceKey: PreferenceKey {
  static var defaultValue: CGSize = .zero
  static func reduce(value: inout CGSize, nextValue: () -> CGSize) {}
}

extension View {
  func readSize(onChange: @escaping (CGSize) -> Void) -> some View {
    background(
      GeometryReader {
        geometryProxy in
        Color.clear
          .preference(key: SizePreferenceKey.self, value: geometryProxy.size)
      })
      .onPreferenceChange(SizePreferenceKey.self, perform: onChange)
  }
}

struct TruncableText: View {
  let text: Text
  @State private var intrinsicSize: CGSize = .zero
  @State private var truncatedSize: CGSize = .zero
  let isTruncatedUpdate: (_ isTruncated: Bool, _ truncatedSize: CGSize) -> Void
  var body: some View {
    text
      .readSize { size in
        truncatedSize = size
        isTruncatedUpdate(truncatedSize != intrinsicSize, size)
      }
      .background(
        text
          .fixedSize(horizontal: false, vertical: true)
          .hidden()
          .readSize { size in
            intrinsicSize = size
            if truncatedSize != .zero {
              isTruncatedUpdate(truncatedSize != intrinsicSize, truncatedSize)
            }
          })
  }
}

/**
 - Parameter text: a string of text to format
 - Parameter bgColor: the color of the widget background
 - Returns: a Text view with the specified size
 */
func makeText(_ text:String, bgColor: UIColor) -> Text {
  return Text(text)
    .font(.system(size:12))
    .foregroundColor(bgColor.isLight() ? Color.black : Color.white)
}

/**
 - Parameter text: The entire contents of the note
 - Parameter size: The size of the text area that was used to initially render the first note
 */
func partitionText(_ text: String, size: CGSize, widgetWidth: CGFloat) -> (String, String)? {
  var part1 = ""
  var part2 = text
  
  let colWidth = widgetWidth / 2 - 32 // padding
  let colHeight = size.height
  print("colw: \(colWidth) colH: \(colHeight)")
  
  // Shouldn't happen but just block against infinite loops
  for i in 0...100 {
    // Find the first line, or if that doesn't work the first space
    var splitAt = part2.firstIndex(of: "\n")
    if (splitAt == nil) {
      splitAt = part2.firstIndex(of: "\r")
      if (splitAt == nil) {
        splitAt = part2.firstIndex(of: " ")
      }
    }
    
    // We have a block of letters remaining. Let's not split it.
    if splitAt == nil {
      if i == 0 {
        // If we haven't split anything yet, just show the text as a single block
        return nil
      } else {
        // Divide what we had
        break
      }
    }
    
    let part1Test = String(text[...text.index(splitAt!, offsetBy: part1.count)])
    let part1TestSize = part1Test
      .trimmingCharacters(in: .newlines)
      .boundingRect(with: CGSize(width: colWidth, height: .infinity),
                    options: .usesLineFragmentOrigin,
                    attributes: [.font: UIFont.systemFont(ofSize: 12)],
                    context: nil)
    
    if (part1TestSize.height > colHeight) {
      // We exceeded the limit! return what we have
      break;
    }
    
    part1 = part1Test
    part2 = String(part2[part2.index(splitAt!, offsetBy: 1)...])
//    print("p1: '\(part1)', p2: '\(part2)', p1Height: \(part1TestSize.height)".replacingOccurrences(of: "\n", with: "N"))
  }
//  print("p1: '\(part1)', p2: '\(part2)'".replacingOccurrences(of: "\n", with: "N"))
  return (part1.trimmingCharacters(in: .newlines), part2.trimmingCharacters(in: .newlines))
}


func getWidgetWidth(_ family: WidgetFamily) -> CGFloat {
  switch family {
    case .systemLarge, .systemMedium:
      switch UIScreen.main.bounds.size {
        case CGSize(width: 428, height: 926):   return 364
        case CGSize(width: 414, height: 896):   return 360
        case CGSize(width: 414, height: 736):   return 348
        case CGSize(width: 390, height: 844):   return 338
        case CGSize(width: 375, height: 812):   return 329
        case CGSize(width: 375, height: 667):   return 321
        case CGSize(width: 360, height: 780):   return 329
        case CGSize(width: 320, height: 568):   return 292
        default:                                return 330
      }
    default:
      switch UIScreen.main.bounds.size {
        case CGSize(width: 428, height: 926):   return 170
        case CGSize(width: 414, height: 896):   return 169
        case CGSize(width: 414, height: 736):   return 159
        case CGSize(width: 390, height: 844):   return 158
        case CGSize(width: 375, height: 812):   return 155
        case CGSize(width: 375, height: 667):   return 148
        case CGSize(width: 360, height: 780):   return 155
        case CGSize(width: 320, height: 568):   return 141
        default:                                return 155
      }
    }
}
