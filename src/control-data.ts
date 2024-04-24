import { CCControl } from "./type";

export const initialGlobalControls: ReadonlyArray<Omit<CCControl, "value">> = [
  {
    name: "MIDI Channel In",
    cc: 14,
    initialValue: 0,
    gbDisplay: "In",
  },
  {
    name: "MIDI Channel Out",
    cc: 15,
    initialValue: 0,
    gbDisplay: "ot",
  },
  {
    name: "Speaker",
    cc: 119,
    initialValue: 0,
    gbDisplay: "SP",
  },
  {
    name: "Slip chance",
    cc: 89,
    initialValue: 0,
    gbDisplay: "SC",
  },
];

export const initialSequenceControls: ReadonlyArray<Omit<CCControl, "value">> =
  [
    {
      name: "Base note length",
      cc: 20,
      initialValue: 0,
      gbDisplay: "nL",
    },
    {
      name: "Sequence length",
      cc: 21,
      initialValue: 0,
      gbDisplay: "SL",
    },
    {
      name: "Octave: one up",
      cc: 22,
      initialValue: 0,
      gbDisplay: "o-",
    },
    {
      name: "Octave: one down",
      cc: 23,
      initialValue: 0,
      gbDisplay: "o-",
    },
    {
      name: "Octave: two up",
      cc: 24,
      initialValue: 0,
      gbDisplay: "o=",
    },
    {
      name: "Octave: two down",
      cc: 25,
      initialValue: 0,
      gbDisplay: "o=",
    },
    {
      name: "Double length",
      cc: 26,
      initialValue: 0,
      gbDisplay: "dL",
    },
    {
      name: "Half length",
      cc: 27,
      initialValue: 0,
      gbDisplay: "HL",
    },
    {
      name: "Ratchet",
      cc: 28,
      initialValue: 0,
      gbDisplay: "rA",
    },
    {
      name: "Rest",
      cc: 29,
      initialValue: 0,
      gbDisplay: "rE",
    },
    // These are too chaotic for random mode
    {
      name: "Fifth up",
      cc: 85,
      initialValue: 0,
      gbDisplay: "Ft",
      excludeFromRandom: true
    },
    {
      name: "Random interval",
      cc: 86,
      initialValue: 0,
      gbDisplay: "rn",
      excludeFromRandom: true
    },
    {
      name: "Random length",
      cc: 87,
      initialValue: 0,
      gbDisplay: "rL",
      excludeFromRandom: true
    },
  ];
