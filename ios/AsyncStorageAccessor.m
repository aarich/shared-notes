////
////  AsyncStorageAccessor.m
////  sharednotes
////
////  Created by Alex Rich on 2/8/21.
////
//
//#import <Foundation/Foundation.h>
//#import <RNCAsyncStorage.h>
//
//@interface AsyncStorageAccessor : NSObject
//
//@end
//
//@implementation AsyncStorageAccessor
//
//-(instancetype)init {
//  self = [super init];
//  return self;
//}
//
//- (NSString *)getStringForKey:(NSString *)key {
//  NSArray *keyArray = [NSArray arrayWithObjects:key, nil];
//  NSMutableString *result = [NSMutableString stringWithString:@""];
//  [[RNCAsyncStorage alloc] multiGet:keyArray callback:^(NSArray *response) {
//    NSObject *error = [response objectAtIndex:0];
//    if (error != nil) {
//      [result appendString:@"ERROR"];
//      return;
//    }
//    
//    NSArray *values = (NSArray*)[response objectAtIndex:1];
//    
//    [result appendString:[values objectAtIndex:0]];
//  }];
//   
//  return result;
//}
//
//
//@end
