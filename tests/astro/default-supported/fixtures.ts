import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'supported attributes and supported functions',
    input: `
<!-- -------------------------------------------------------| printWidth=60 (in snapshot) -->
<div>
  <div>
    <div>
      <div class={classNames('lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')}>
        <span>lorem ipsum</span>
      </div>
      <div className={classNames('lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')}>
        <span>lorem ipsum</span>
      </div>
      <div class:list={[classNames('lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')]}>
        <span>lorem ipsum</span>
      </div>
    </div>
  </div>
</div>
`,
  },
  {
    name: 'supported attributes and unsupported functions',
    input: `
<!-- -------------------------------------------------------| printWidth=60 (in snapshot) -->
<div>
  <div>
    <div>
      <div class={foo('lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')}>
        <span>lorem ipsum</span>
      </div>
      <div className={foo('lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')}>
        <span>lorem ipsum</span>
      </div>
      <div class:list={[foo('lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')]}>
        <span>lorem ipsum</span>
      </div>
    </div>
  </div>
</div>
`,
  },
  {
    name: 'unsupported attributes and supported functions',
    input: `
//----------------------------------------------------------| printWidth=60 (in snapshot)
<div>
  <div>
    <div>
      <div title={classNames('lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')}>
        <span>lorem ipsum</span>
      </div>
    </div>
  </div>
</div>
`,
  },
  {
    name: 'unsupported attributes and unsupported functions',
    input: `
//----------------------------------------------------------| printWidth=60 (in snapshot)
<div>
  <div>
    <div>
      <div title={foo('lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')}>
        <span>lorem ipsum</span>
      </div>
    </div>
  </div>
</div>
`,
  },
];
