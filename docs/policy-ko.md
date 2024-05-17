# 서식 지정 정책

이 문서에서 명시하는 정책은 0.7.0부터 적용된다.

## 공백

1. 클래스명 중간의 공백

   단일 공백으로 처리된다.

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

1. 클래스명 양 끝의 공백

   표현식으로 작성된 경우 단일 공백으로 처리되고, 표현식이 아니면 양 끝의 공백을 제거한다.

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

## 들여쓰기

클래스명에 줄바꿈이 발생하면 일반적으로는 첫 번째 줄의 들여쓰기 수준을 따르지만, `endingPosition` 옵션과 구문 유형에 따라 조정될 수 있다.

1. `endingPosition: 'absolute'`일 때

   들여쓰기 수준이 0으로 고정된다.

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

1. `endingPosition: 'absolute'`가 아닐 때

   클래스명이 삼항 연산자의 피연산자이거나, 첫 번째 줄이 해당 속성의 이름과 같은 줄에 있는 경우 들여쓰기 수준이 한 단계 추가된다.

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

## 구분자 변환

표현식으로 작성된 클래스명은, 서식 지정 결과에 따라 양 끝의 구분자가 변환될 수 있다.

1. 여러 줄로 나누어 쓰기에 충분히 긴 클래스명

   백틱으로 변환한다.

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

1. 한 줄로 쓰기에 충분히 짧은 클래스명

   가능하면 따옴표로 변환(`singleQuote` 옵션을 따름)하고, 불가능한 경우 입력에 사용한 구분자를 유지한다.

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

## (제목 미정)

표현식으로 작성된 클래스명은, 줄바꿈 과정에서 입력 텍스트가 그대로 사용되지 않는다. 문자열로 평가된 값이 사용된다.

예를 들어 다음과 같은 경우, 입력 텍스트의 클래스명 길이는 `printWidth`를 초과하지만, 이것을 문자열로 평가한 값은 초과하지 않는다. 따라서 서식 지정 결과에는 줄바꿈이 발생하지 않는다.

<!-- prettier-ignore -->
```typescript
// options
{ printWidth: 60, endingPosition: 'relative' }

// input
export function Foo({ children }) {
  return (
    <div className={`lorem ipsum do\`or sit amet consectetur adipiscing elit proin`}>
      {children}
    </div>
  );
}

// output
export function Foo({ children }) {
  return (
    <div
      className={
        "lorem ipsum do`or sit amet consectetur adipiscing elit proin"
      }
    >
      {children}
    </div>
  );
}
```