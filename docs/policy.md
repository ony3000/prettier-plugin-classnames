# Formatting Policies

The policies specified in this document apply starting from 0.7.0.

## Spaces

1. Space in middle of class name

   It is treated as a single space.

   <!-- prettier-ignore -->
   ```typescript
   // options
   { printWidth: 60 }

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
   // options
   { printWidth: 60 }

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
   // options
   { printWidth: 60 }

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
   // options
   { printWidth: 60 }

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

When a line wrapping occurs in a class name, it generally follows the indentation level of the first line.

As an exception, if the class name is an operand of a ternary operator, or if the first line is on the same line as its attribute, one level of indentation is added.

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
{ printWidth: 60, endingPosition: 'absolute' }

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

For class names written as expressions, the delimiters at both ends can be converted depending on the formatting result. However, if the parser is specified as `angular`, it is fixed with single quotes.

1. Class name long enough to be split across multiple lines

   Convert to backticks.

   <!-- prettier-ignore -->
   ```typescript
   // options
   { printWidth: 60, endingPosition: 'absolute' }

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
   { printWidth: 60, endingPosition: 'absolute' }

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
   { printWidth: 60, singleQuote: false }

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

## Conditional Escape

After the delimiters at both ends of the class name are determined, if the same character as the delimiter is included in the class name, that character is escaped.

<!-- prettier-ignore -->
```typescript
// options
{ printWidth: 60, endingPosition: 'relative' }

// input
export function Foo({ children }) {
  return (
    <div className={"lorem ipsum do`or sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere"}>
      {children}
    </div>
  );
}

// output
export function Foo({ children }) {
  return (
    <div
      className={`lorem ipsum do\`or sit amet consectetur adipiscing elit
        proin ex massa hendrerit eu posuere`}
    >
      {children}
    </div>
  );
}
```

## Syntax Evaluation

During the formatting process, some syntax is treated as if it were evaluated as a string.

1. Syntax treated in the `prettier.format` phase

   <!-- prettier-ignore -->
   ```typescript
   // options
   { printWidth: 60 }

   // input
   export function Foo({ children }) {
     return (
       <div className={"lorem ipsum do\"or sit amet"}>
         {children}
       </div>
     );
   }

   // output
   export function Foo({ children }) {
     return (
       <div className={'lorem ipsum do"or sit amet'}>
         {children}
       </div>
     );
   }
   ```

1. Syntax treated in the line wrapping phase

   <!-- prettier-ignore -->
   ```typescript
   // options
   { printWidth: 60 }

   // input
   export function Foo({ children }) {
     return (
       <div className={
         'lorem ipsum\
         dolor sit amet'
       }>
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

## Freezing

At the line wrapping phase, the class name whose formatting has been completed is temporarily &ldquo;frozen&rdquo; until the formatting of the remaining class names is completed.

In simple class names, this freezing process does not have much meaning, but in nested expressions, it is used for the purpose of keeping the formatting results of the inner class name.

For example, in the following input, the outer class name(`` `lorem ipsum dolor sit amet ${...} ex massa hendrerit eu posuere` ``) is formatted after the inner class name(`'consectetur adipiscing elit proin'`) has been formatted. If there is no freezing processing, the format of the inner class name may be broken when processing the outer class name.

<!-- prettier-ignore -->
```typescript
// options
{ printWidth: 60, endingPosition: 'relative' }

// input
export function Foo({ children }) {
  return (
    <div className={`lorem ipsum dolor sit amet ${
      'consectetur adipiscing elit proin'
    } ex massa hendrerit eu posuere`}>
      {children}
    </div>
  );
}

// output
export function Foo({ children }) {
  return (
    <div
      className={`lorem ipsum dolor sit amet
        ${"consectetur adipiscing elit proin"} ex massa hendrerit eu
        posuere`}
    >
      {children}
    </div>
  );
}
```

Non-class name syntaxes are generally not touched, but the ternary operator is treated as an exception. The ternary operator freezes the entire syntax without formatting.

<!-- prettier-ignore -->
```typescript
// options
{ printWidth: 60, endingPosition: 'relative' }

// input
export function Foo({ children }) {
  return (
    <div className={`lorem ipsum dolor sit amet ${
      condition ? 'adipiscing' : 'elit proin'
    } ex massa hendrerit eu posuere`}>
      {children}
    </div>
  );
}

// output
export function Foo({ children }) {
  return (
    <div
      className={`lorem ipsum dolor sit amet ${
        condition ? "adipiscing" : "elit proin"
      } ex massa hendrerit
        eu posuere`}
    >
      {children}
    </div>
  );
}
```
