import { useEffect, useState } from "react";
import "./App.css";
import Control from "./components/Control";
import useMidi from "./hooks/useMidi";
import { CCControl } from "./type";

const initialSequenceControls: ReadonlyArray<Omit<CCControl, "value">> = [
  {
    name: "Note length",
    cc: 20,
    initialValue: 0,
  },
  {
    name: "Sequence length",
    cc: 21,
    initialValue: 0,
  },
  {
    name: "Octave: one up",
    cc: 22,
    initialValue: 0,
  },
  {
    name: "Octave: one down",
    cc: 23,
    initialValue: 0,
  },
  {
    name: "Octave: two up",
    cc: 24,
    initialValue: 0,
  },
  {
    name: "Octave: two down",
    cc: 25,
    initialValue: 0,
  },
  {
    name: "Double length",
    cc: 26,
    initialValue: 0,
  },
  {
    name: "Ratchet",
    cc: 27,
    initialValue: 0,
  },
  {
    name: "Rest",
    cc: 28,
    initialValue: 0,
  },
  {
    name: "Speaker",
    cc: 119,
    initialValue: 0,
  },
];

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function formatInitialState(
  base: ReadonlyArray<Omit<CCControl, "value">>
): ReadonlyArray<CCControl> {
  return base.map((control) => ({
    ...control,
    value: control.initialValue,
  }));
}

function App() {
  const [sequenceControls, setSequenceControls] = useState(
    formatInitialState(initialSequenceControls)
  );
  const {
    inputOptions,
    outputOptions,
    selectInputById,
    selectOutputById,
    input,
    output,
  } = useMidi();

  useEffect(() => {
    if (input && output) {
      input.onmidimessage = (message) => {
        output.send(message.data as Uint8Array);
      };
    }

    return () => {
      if (input) {
        input.onmidimessage = null;
      }
    };
  }, [input, output]);

  function sendCC(cc: number, value: number) {
    if (output) {
      output.send([0xb0, cc, value]);
    }
  }

  function randomize() {
    const next = sequenceControls.map((e) => {
      return {
        ...e,
        value: getRandomInt(128),
      };
    });
    setSequenceControls(next);
  }

  function sendAll() {
    sequenceControls.forEach((e) => {
      sendCC(e.cc, e.value);
    });
  }

  function panic() {
    if (!output) return;

    sendCC(117, 127);

    setTimeout(() => {
      sendCC(117, 0);
    }, 50);

    for (let ch = 0; ch < 16; ch++) {
      const command = 0x80 + ch;
      for (let note = 0; note < 127; note++) {
        output.send([command, note, 64]);
      }
    }
  }

  function handleCCChange(cc: number, value: number) {
    sendCC(cc, value);
    const next = sequenceControls.map((e) => {
      return {
        ...e,
        value: e.cc === cc ? value : e.value,
      };
    });
    setSequenceControls(next);
  }

  return (
    <div className="grid">
      <label>
        MIDI Inputs
        <select onChange={(e) => selectInputById(e.target.value)}>
          <option value="" disabled selected>
            -
          </option>
          {inputOptions.map((e) => {
            return (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            );
          })}
        </select>
      </label>

      <label>
        MIDI Outputs
        <select onChange={(e) => selectOutputById(e.target.value)}>
          <option value="" disabled selected>
            -
          </option>
          {outputOptions.map((e) => {
            return (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            );
          })}
        </select>
      </label>

      {output ? (
        <>
          {sequenceControls.map((e) => {
            return (
              <Control
                key={e.cc}
                control={e}
                onChange={(value) => handleCCChange(e.cc, value)}
              />
            );
          })}
          <button onClick={randomize}>Randomize</button>
          <button onClick={sendAll}>Send All</button>
          <button onClick={panic}>Panic</button>
        </>
      ) : (
        <p>Select an output to get started</p>
      )}
    </div>
  );
}

export default App;
