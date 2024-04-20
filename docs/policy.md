# Formatting Policies

The policies specified in this document apply starting from 0.7.0.

## Spaces

1. Space in middle of class name

   It is treated as a single space.

   <!-- prettier-ignore -->
   ```typescript
   // input
   export function Foo({ children }) {
     return (
       <div className="lorem ipsum   dolor    sit  amet">
         {children}
       </div>
     );
   }

   // output
   export function Foo({ children }) {
     return (
       <div className="lorem ipsum dolor sit amet">
         {children}
       </div>
     );
   }
   ```

   <!-- prettier-ignore -->
   ```typescript
   // input
   export function Foo({ children }) {
     return (
       <div className={"lorem ipsum   dolor    sit  amet"}>
         {children}
       </div>
     );
   }

   // output
   export function Foo({ children }) {
     return (
       <div className={"lorem ipsum dolor sit amet"}>
         {children}
       </div>
     );
   }
   ```

1. Space at both ends of class name

   If it is written as an expression, it is treated as a single space; otherwise, the spaces at both ends are removed.

   <!-- prettier-ignore -->
   ```typescript
   // input
   export function Foo({ children }) {
     return (
       <div className="  lorem ipsum dolor sit amet  ">
         {children}
       </div>
     );
   }

   // output
   export function Foo({ children }) {
     return (
       <div className="lorem ipsum dolor sit amet">
         {children}
       </div>
     );
   }
   ```

   <!-- prettier-ignore -->
   ```typescript
   // input
   export function Foo({ children }) {
     return (
       <div className={"  lorem ipsum  " + "  dolor sit amet  "}>
         {children}
       </div>
     );
   }

   // output
   export function Foo({ children }) {
     return (
       <div className={" lorem ipsum " + " dolor sit amet "}>
         {children}
       </div>
     );
   }
   ```

## Delimiter Conversion

For class names written as expressions, the delimiters at both ends can be converted depending on the formatting result.

1. Class name long enough to be split across multiple lines

   Convert to backticks.

   <!-- prettier-ignore -->
   ```typescript
   // options
   { printWidth: 60, endingPosition: 'absolute-with-indent' }

   // input
   export function Foo({ children }) {
     return (
       <div className={"lorem ipsum dolor sit amet consectetur adipiscing elit proin"}>
         {children}
       </div>
     );
   }

   // output
   export function Foo({ children }) {
     return (
       <div
         className={`lorem ipsum dolor sit amet consectetur
           adipiscing elit proin`}
       >
         {children}
       </div>
     );
   }
   ```

   <!-- prettier-ignore -->
   ```typescript
   // options
   { printWidth: 60, endingPosition: 'absolute-with-indent' }

   // input
   export function Foo({ children }) {
     return (
       <div
         className={classNames({
           "lorem ipsum dolor sit amet consectetur adipiscing elit proin": true,
         })}
       >
         {children}
       </div>
     );
   }

   // output
   export function Foo({ children }) {
     return (
       <div
         className={classNames({
           [`lorem ipsum dolor sit amet consectetur adipiscing
           elit proin`]: true,
         })}
       >
         {children}
       </div>
     );
   }
   ```

1. Class name short enough to be written on a single line

   If possible, convert to quotes (following the `singleQuote` option); otherwise, keep the delimiters used in the input.

   <!-- prettier-ignore -->
   ```typescript
   // options
   { singleQuote: false }

   // input
   export function Foo({ children }) {
     return (
       <div className={`lorem ipsum dolor sit amet`}>
         {children}
       </div>
     );
   }

   // output
   export function Foo({ children }) {
     return (
       <div className={"lorem ipsum dolor sit amet"}>
         {children}
       </div>
     );
   }
   ```

   <!-- prettier-ignore -->
   ```typescript
   // options
   { singleQuote: false }

   // input
   export function Foo({ children }) {
     return (
       <div
         className={classNames({
           [`lorem ipsum dolor sit amet`]: true,
         })}
       >
         {children}
       </div>
     );
   }

   // output
   export function Foo({ children }) {
     return (
       <div
         className={classNames({
           "lorem ipsum dolor sit amet": true,
         })}
       >
         {children}
       </div>
     );
   }
   ```
