import { useEffect, useState } from "react";

type MidiIO = {
  name: string | null;
  id: string;
};

function mapMidi(io: MIDIInput | MIDIOutput) {
  return {
    name: io.name,
    id: io.id,
  };
}

export default function useMidi() {
  const [initializing, setInitializing] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [midiAccess, setMidiAccess] = useState<MIDIAccess>();
  const [input, setInput] = useState<MIDIInput>();
  const [inputOptions, setInputOptions] = useState<ReadonlyArray<MidiIO>>([]);
  const [output, setOutput] = useState<MIDIOutput>();
  const [outputOptions, setOutputOptions] = useState<ReadonlyArray<MidiIO>>([]);

  useEffect(() => {
    if (!initializing && !initialized) {
      setInitializing(true);

      navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
    }
  }, [initializing, initialized]);

  function onMIDISuccess(_midiAccess: unknown) {
    const access = _midiAccess as MIDIAccess;
    setMidiAccess(access);
    setInputOptions(Array.from(access.inputs).map((e) => mapMidi(e[1])));
    setOutputOptions(Array.from(access.outputs).map((e) => mapMidi(e[1])));
    setInitialized(true);
  }

  function onMIDIFailure(msg: string) {
    console.error(`Failed to get MIDI access - ${msg}`);
  }

  function selectInputById(id: string) {
    if (!midiAccess) return;

    for (const entry of midiAccess.inputs) {
      if (entry[1].id === id) {
        setInput(entry[1]);
        return;
      }
    }
  }

  function selectOutputById(id: string) {
    if (!midiAccess) return;

    for (const entry of midiAccess.outputs) {
      if (entry[1].id === id) {
        setOutput(entry[1]);
        return;
      }
    }
  }

  return {
    inputOptions,
    outputOptions,
    selectInputById,
    selectOutputById,
    input,
    output,
  };
}
