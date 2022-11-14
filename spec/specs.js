const Jasmine = require('jasmine');
const JasmineConsoleReporter = require('jasmine-console-reporter');
const jasmine = new Jasmine();
jasmine.loadConfigFile('spec/support/jasmine.json');

const jasmineConsoleReporter = new JasmineConsoleReporter({
 colors: 1,
 cleanStack: 1,
 verbosity: 4,
 listStyle: 'indent',
 timeUnit: 'ms',
 timeThreshold: {
  ok: 500,
  warn: 1000,
  ouch: 3000
 },
 activity: false,
 emoji: true,
 beep: true,
});

jasmine.addReporter(jasmineConsoleReporter);
jasmine.execute();