import { format } from 'prettier';
import { baseOptions } from 'test-settings';
import { expect, test } from 'vitest';

import { thisPlugin } from './adaptor';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'babel',
  endingPosition: 'relative',
  debugFlag: true,
};

const input = `
import "./App.css";
import {
  Button,
  ButtonGroup,
  Checkbox,
  CircularProgress,
  IconAdapter,
  IconButton,
  LinearProgress,
  Radio,
} from "tailwind-joy/components";
import {
  MdAdd,
  MdCheck,
  MdClose,
  MdFavoriteBorder,
  MdKeyboardArrowRight,
  MdReport,
  MdSend,
  MdSettings,
  MdWarning,
} from "react-icons/md";

function App() {
  return (
    <main className="flex min-h-screen flex-col gap-4 px-5 py-8">
      <div>
        <Button>Button</Button>
        <Button disabled>Disabled</Button>
        <Button loading>Loading</Button>
      </div>
      <div>
        <Button disabled variant="solid">
          Solid
        </Button>
        <Button disabled variant="soft">
          Soft
        </Button>
        <Button disabled variant="outlined">
          Outlined
        </Button>
        <Button disabled variant="plain">
          Plain
        </Button>
      </div>
      <div>
        <Button loading variant="solid">
          Solid
        </Button>
        <Button loading variant="soft">
          Soft
        </Button>
        <Button loading variant="outlined">
          Outlined
        </Button>
        <Button loading variant="plain">
          Plain
        </Button>
      </div>
      <div>
        <Button variant="solid">Solid</Button>
        <Button variant="soft">Soft</Button>
        <Button variant="outlined">Outlined</Button>
        <Button variant="plain">Plain</Button>
      </div>
      <div>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>
      <div>
        <Button color="primary">Primary</Button>
        <Button color="neutral">Neutral</Button>
        <Button color="danger">Danger</Button>
        <Button color="success">Success</Button>
        <Button color="warning">Warning</Button>
      </div>
      <div>
        <Button
          color="primary"
          startDecorator={
            <IconAdapter>
              <MdAdd />
            </IconAdapter>
          }
        >
          Add to cart
        </Button>
        <Button
          color="success"
          endDecorator={
            <IconAdapter>
              <MdKeyboardArrowRight />
            </IconAdapter>
          }
        >
          Go to checkout
        </Button>
      </div>
      <div>
        <Button loading>Default</Button>
        <Button loading loadingIndicator="Loading...">
          Custom
        </Button>
      </div>
      <div>
        <Button loading loadingPosition="start">
          Start
        </Button>
        <Button
          loading
          loadingPosition="end"
          endDecorator={
            <IconAdapter>
              <MdSend />
            </IconAdapter>
          }
        >
          End
        </Button>
      </div>
      <div>
        <IconButton variant="solid">
          <IconAdapter>
            <MdFavoriteBorder />
          </IconAdapter>
        </IconButton>
        <IconButton variant="soft">
          <IconAdapter>
            <MdFavoriteBorder />
          </IconAdapter>
        </IconButton>
        <IconButton variant="outlined">
          <IconAdapter>
            <MdFavoriteBorder />
          </IconAdapter>
        </IconButton>
        <IconButton variant="plain">
          <IconAdapter>
            <MdFavoriteBorder />
          </IconAdapter>
        </IconButton>
      </div>
      <div>
        <CircularProgress variant="solid" />
        <CircularProgress variant="soft" />
        <CircularProgress variant="outlined" />
        <CircularProgress variant="plain" />
      </div>
      <div>
        <CircularProgress size="sm" />
        <CircularProgress size="md" />
        <CircularProgress size="lg" />
      </div>
      <div>
        <CircularProgress color="primary" />
        <CircularProgress color="neutral" />
        <CircularProgress color="danger" />
        <CircularProgress color="success" />
        <CircularProgress color="warning" />
      </div>
      <div>
        <CircularProgress thickness={1} />
      </div>
      <div>
        <CircularProgress determinate value={25} />
        <CircularProgress determinate value={50} />
        <CircularProgress determinate value={75} />
        <CircularProgress determinate value={100} />
      </div>
      <div>
        <CircularProgress color="warning">
          <IconAdapter color="warning">
            <MdWarning />
          </IconAdapter>
        </CircularProgress>
        <CircularProgress size="lg" determinate value={66.67}>
          2 / 3
        </CircularProgress>
        <CircularProgress
          color="danger"
          className="[--CircularProgress-size:80px]"
        >
          <IconAdapter color="danger">
            <MdReport />
          </IconAdapter>
        </CircularProgress>
      </div>
      <div>
        <Button startDecorator={<CircularProgress variant="solid" />}>
          Loading...
        </Button>
        <IconButton>
          <CircularProgress />
        </IconButton>
      </div>
      <div>
        <LinearProgress variant="solid" />
        <LinearProgress variant="soft" />
        <LinearProgress variant="outlined" />
        <LinearProgress variant="plain" />
      </div>
      <div>
        <LinearProgress size="sm" />
        <LinearProgress size="md" />
        <LinearProgress size="lg" />
      </div>
      <div>
        <LinearProgress color="primary" />
        <LinearProgress color="neutral" />
        <LinearProgress color="danger" />
        <LinearProgress color="success" />
        <LinearProgress color="warning" />
      </div>
      <div>
        <LinearProgress thickness={1} />
      </div>
      <div>
        <LinearProgress determinate value={25} />
        <LinearProgress determinate value={50} />
        <LinearProgress determinate value={75} />
        <LinearProgress determinate value={100} />
      </div>
      <div>
        <ButtonGroup>
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
          <IconButton>
            <IconAdapter>
              <MdSettings />
            </IconAdapter>
          </IconButton>
        </ButtonGroup>
      </div>
      <div>
        <ButtonGroup variant="solid">
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
        <ButtonGroup variant="soft">
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
        <ButtonGroup variant="outlined">
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
        <ButtonGroup variant="plain">
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
      </div>
      <div>
        <ButtonGroup size="sm">
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
        <ButtonGroup size="md">
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
        <ButtonGroup size="lg">
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
      </div>
      <div>
        <ButtonGroup color="primary">
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
        <ButtonGroup color="neutral">
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
        <ButtonGroup color="danger">
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
        <ButtonGroup color="success">
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
        <ButtonGroup color="warning">
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
      </div>
      <div>
        <ButtonGroup disabled>
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
          <IconButton disabled={false}>
            <IconAdapter>
              <MdSettings />
            </IconAdapter>
          </IconButton>
        </ButtonGroup>
      </div>
      <div>
        <ButtonGroup spacing="0.5rem">
          <Button>One</Button>
          <Button disabled>Two</Button>
          <Button>Three</Button>
          <IconButton>
            <IconAdapter>
              <MdSettings />
            </IconAdapter>
          </IconButton>
        </ButtonGroup>
      </div>
      <div>
        <ButtonGroup orientation="vertical" variant="solid">
          <Button>One</Button>
          <Button disabled>Two</Button>
          <Button>Three</Button>
          <IconButton>
            <IconAdapter>
              <MdSettings />
            </IconAdapter>
          </IconButton>
        </ButtonGroup>
        <ButtonGroup orientation="vertical" variant="soft">
          <Button>One</Button>
          <Button disabled>Two</Button>
          <Button>Three</Button>
          <IconButton>
            <IconAdapter>
              <MdSettings />
            </IconAdapter>
          </IconButton>
        </ButtonGroup>
        <ButtonGroup orientation="vertical" variant="outlined">
          <Button>One</Button>
          <Button disabled>Two</Button>
          <Button>Three</Button>
          <IconButton>
            <IconAdapter>
              <MdSettings />
            </IconAdapter>
          </IconButton>
        </ButtonGroup>
        <ButtonGroup orientation="vertical" variant="plain">
          <Button>One</Button>
          <Button disabled>Two</Button>
          <Button>Three</Button>
          <IconButton>
            <IconAdapter>
              <MdSettings />
            </IconAdapter>
          </IconButton>
        </ButtonGroup>
      </div>
      <div>
        <ButtonGroup buttonFlex={1} className="w-[350px] max-w-full">
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
          <IconButton>
            <IconAdapter>
              <MdSettings />
            </IconAdapter>
          </IconButton>
        </ButtonGroup>
      </div>
      <div>
        <ButtonGroup buttonFlex="0 1 200px" className="w-full justify-center">
          <Button>One</Button>
          <Button>Two</Button>
        </ButtonGroup>
      </div>
      <div>
        <ButtonGroup
          variant="soft"
          // @ts-expect-error: css variable
          style={{ "--ButtonGroup-separatorColor": "hsl(270 100% 50%)" }}
        >
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
      </div>
      <div>
        <Checkbox label="Label" />
        <Checkbox label="Label" defaultChecked />
      </div>
      <div>
        <Checkbox label="Solid" variant="solid" defaultChecked />
        <Checkbox label="Soft" variant="soft" defaultChecked />
        <Checkbox label="Outlined" variant="outlined" defaultChecked />
        <Checkbox label="Plain" variant="plain" defaultChecked />
      </div>
      <div>
        <Checkbox label="Small" size="sm" defaultChecked />
        <Checkbox label="Medium" size="md" defaultChecked />
        <Checkbox label="Large" size="lg" defaultChecked />
      </div>
      <div>
        <Checkbox label="Primary" color="primary" defaultChecked />
        <Checkbox label="Neutral" color="neutral" defaultChecked />
        <Checkbox label="Danger" color="danger" defaultChecked />
        <Checkbox label="Success" color="success" defaultChecked />
        <Checkbox label="Warning" color="warning" defaultChecked />
      </div>
      <div>
        <Checkbox
          label="I have an icon when unchecked"
          uncheckedIcon={
            <IconAdapter>
              <MdClose />
            </IconAdapter>
          }
        />
      </div>
      <div>
        <Checkbox
          label="My unchecked icon appears on hover"
          uncheckedIcon={
            <IconAdapter>
              <MdCheck />
            </IconAdapter>
          }
          className="[&:has(:checked)_svg]:opacity-100 [&:has(:focus-visible)_svg]:opacity-100 [&:hover_svg]:opacity-100 [&_svg]:opacity-0"
        />
      </div>
      <div>
        <div className="relative px-3 py-1 [--unstable_actionRadius:20px]">
          <Checkbox
            disabled
            overlay
            disableIcon
            variant="soft"
            label="Pepperoni"
          />
        </div>
        <div className="relative px-3 py-1 [--unstable_actionRadius:20px]">
          <Checkbox overlay disableIcon variant="soft" label="Cheese" />
        </div>
      </div>
      <div>
        <Checkbox label="Fully wrapped" defaultChecked />
        <Checkbox
          label="Input wrapped"
          defaultChecked
          className="[&>.tj-checkbox-checkbox]:relative"
        />
      </div>
      <div>
        <div className="border-joy-neutral-300 dark:border-joy-neutral-700 bg-joy-neutral-50 dark:bg-joy-neutral-900 relative flex rounded-lg border border-solid p-4">
          <Checkbox label="Focus on me" overlay />
        </div>
      </div>
      <div>
        <Checkbox label="Parent" checked={false} indeterminate />
      </div>
      <div>
        <Radio name="radio-basics" label="One" value="one" defaultChecked />
        <Radio name="radio-basics" label="Two" value="two" />
      </div>
      <div>
        <Radio name="radio-variants" label="Solid" variant="solid" />
        <Radio name="radio-variants" label="Soft" variant="soft" />
        <Radio
          name="radio-variants"
          label="Outlined"
          variant="outlined"
          defaultChecked
        />
        <Radio name="radio-variants" label="Plain" variant="plain" />
      </div>
      <div>
        <Radio name="radio-sizes" label="Small" size="sm" />
        <Radio name="radio-sizes" label="Medium" size="md" defaultChecked />
        <Radio name="radio-sizes" label="Large" size="lg" />
      </div>
      <div>
        <Radio name="radio-colors" label="Primary" color="primary" />
        <Radio name="radio-colors" label="Neutral" color="neutral" />
        <Radio name="radio-colors" label="Danger" color="danger" />
        <Radio name="radio-colors" label="Success" color="success" />
        <Radio name="radio-colors" label="Warning" color="warning" />
      </div>
      <div>
        <Radio name="radio-position" label="One" className="flex-row-reverse" />
        <Radio name="radio-position" label="Two" className="flex-row-reverse" />
      </div>
      <div>
        <Radio name="radio-focus-outline" label="Fully wrapped" />
        <Radio
          name="radio-focus-outline"
          label="Input wrapped"
          className="[&>.tj-radio-radio]:relative"
        />
      </div>
      <div>
        <div className="border-joy-neutral-300 dark:border-joy-neutral-700 bg-joy-neutral-50 dark:bg-joy-neutral-900 relative flex rounded-lg border border-solid p-4 [--unstable_actionRadius:calc(8px-var(--variant-borderWidth,0px))]">
          <Radio name="radio-clickable-container" label="Focus on me" overlay />
        </div>
      </div>
    </main>
  );
}

export default App;
`;

test('This test does not verify correctness', () => {
  format(input, options);

  expect(true).toBe(true);
});
