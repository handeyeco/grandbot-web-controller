import { useEffect, useState } from "react";
import "./App.css";
import Control from "./components/Control";
import useMidi from "./hooks/useMidi";
import { CCControl } from "./type";
import { initialGlobalControls, initialSequenceControls } from "./control-data";

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
  const [globalControls, setGlobalControls] = useState(
    formatInitialState(initialGlobalControls)
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

  function reset() {
    const next = sequenceControls.map((e) => {
      return {
        ...e,
        value: 0,
      };
    });
    setSequenceControls(next);
  }

  function sendAll() {
    sequenceControls.forEach((e) => {
      sendCC(e.cc, e.value);
    });
  }

  function sendMomentary(cc: number) {
    sendCC(cc, 127);

    setTimeout(() => {
      sendCC(cc, 0);
    }, 50);
  }

  function panic() {
    if (!output) return;

    sendMomentary(117);

    for (let ch = 0; ch < 16; ch++) {
      const command = 0x80 + ch;
      for (let note = 0; note < 127; note++) {
        output.send([command, note, 64]);
      }
    }
  }

  function handleCCChange(
    cc: number,
    value: number,
    map: ReadonlyArray<CCControl>,
    setter: (next: ReadonlyArray<CCControl>) => void
  ) {
    sendCC(cc, value);
    const next = map.map((e) => {
      return {
        ...e,
        value: e.cc === cc ? value : e.value,
      };
    });
    setter(next);
  }

  function handleSeqParamChange(cc: number, value: number) {
    handleCCChange(cc, value, sequenceControls, setSequenceControls);
  }

  function handleGlobalParamChange(cc: number, value: number) {
    handleCCChange(cc, value, globalControls, setGlobalControls);
  }

  return (
    <div className="grid">
      <label>
        MIDI Inputs
        <select
          onChange={(e) => selectInputById(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>
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
        <select
          onChange={(e) => selectOutputById(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>
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
                onChange={(value) => handleSeqParamChange(e.cc, value)}
              />
            );
          })}
          <div></div>
          <button onClick={reset}>Reset</button>
          <button onClick={randomize}>Randomize</button>
          <button onClick={sendAll}>Send All</button>
          <button onClick={() => sendMomentary(118)}>Generate</button>
          <button onClick={panic}>Panic</button>
          <div></div>
          {globalControls.map((e) => {
            return (
              <Control
                key={e.cc}
                control={e}
                onChange={(value) => handleGlobalParamChange(e.cc, value)}
              />
            );
          })}
        </>
      ) : (
        <p>Select an output to get started</p>
      )}
    </div>
  );
}

export default App;
