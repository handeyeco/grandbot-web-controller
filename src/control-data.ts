import { CCControl } from "./type";

export const initialGlobalControls: ReadonlyArray<Omit<CCControl, "value">> = [
  {
    name: "MIDI Channel In",
    cc: 14,
    initialValue: 0,
  },
  {
    name: "MIDI Channel Out",
    cc: 15,
    initialValue: 0,
  },
  {
    name: "Speaker",
    cc: 119,
    initialValue: 0,
  },
];

export const initialSequenceControls: ReadonlyArray<Omit<CCControl, "value">> =
  [
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
  ];
