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

## Indent

When a line wrapping occurs in a class name, it generally follows the indentation level of the first line, but can be adjusted depending on the `endingPosition` option and syntax type.

1. When `endingPosition: 'absolute'`

   The indentation level is fixed to 0.

   <!-- prettier-ignore -->
   ```typescript
   // options
   { printWidth: 60, endingPosition: 'absolute' }

   // input
   export function Foo({ children }) {
     return (
       <div className="lorem ipsum dolor sit amet consectetur adipiscing elit proin">
         {children}
       </div>
     );
   }

   // output
   export function Foo({ children }) {
     return (
       <div
         className="lorem ipsum dolor sit amet consectetur
   adipiscing elit proin"
       >
         {children}
       </div>
     );
   }
   ```

   <!-- prettier-ignore -->
   ```typescript
   // options
   { printWidth: 60, endingPosition: 'absolute' }

   // input
   export function Foo({ children }) {
     return (
       <div className={`lorem ipsum dolor sit amet consectetur adipiscing elit proin`}>
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

1. When not `endingPosition: 'absolute'`

   If the class name is an operand of a ternary operator, or if the first line is on the same line as its attribute, one level of indentation is added.

   <!-- prettier-ignore -->
   ```typescript
   // options
   { printWidth: 60, endingPosition: 'relative' }

   // input
   export function Foo({ children }) {
     return (
       <div className="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere">
         {children}
       </div>
     );
   }

   // output
   export function Foo({ children }) {
     return (
       <div
         className="lorem ipsum dolor sit amet consectetur adipiscing elit proin
           ex massa hendrerit eu posuere"
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
       <div className={
         condition
           ? `lorem ipsum dolor sit amet consectetur adipiscing elit proin`
           : `lorem ipsum dolor sit amet consectetur adipiscing elit proin`
       }>
         {children}
       </div>
     );
   }

   // output
   export function Foo({ children }) {
     return (
       <div
         className={
           condition
             ? `lorem ipsum dolor sit amet consectetur
               adipiscing elit proin`
             : `lorem ipsum dolor sit amet consectetur
               adipiscing elit proin`
         }
       >
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
