// More complex encryption:
// - Uppercase letters: shift by +5 (A-Z)
// - Lowercase letters: shift by +7 (a-z)
// - Digits: permuted using a fixed mapping
// - Symbols (printable, except space): ASCII shift by +3
// - Space remains space

const digitMap = {
  '0': '7',
  '1': '4',
  '2': '9',
  '3': '1',
  '4': '0',
  '5': '8',
  '6': '2',
  '7': '6',
  '8': '3',
  '9': '5'
};

const digitInverseMap = {};
for (const [k, v] of Object.entries(digitMap)) {
  digitInverseMap[v] = k;
}

function encryptChar(ch) {
  const code = ch.charCodeAt(0);

  // Uppercase A-Z
  if (code >= 65 && code <= 90) {
    return String.fromCharCode(((code - 65 + 5) % 26) + 65);
  }

  // Lowercase a-z
  if (code >= 97 && code <= 122) {
    return String.fromCharCode(((code - 97 + 7) % 26) + 97);
  }

  // Digits 0-9
  if (code >= 48 && code <= 57) {
    return digitMap[ch] || ch;
  }

  // Space stays the same
  if (ch === ' ') {
    return ch;
  }

  // Other printable symbols: ASCII shift +3 (for codes 33-126)
  if (code >= 33 && code <= 126) {
    return String.fromCharCode(((code - 33 + 3) % 94) + 33);
  }

  // Fallback: unchanged
  return ch;
}

function decryptChar(ch) {
  const code = ch.charCodeAt(0);

  // Uppercase A-Z (inverse of +5)
  if (code >= 65 && code <= 90) {
    return String.fromCharCode(((code - 65 - 5 + 26) % 26) + 65);
  }

  // Lowercase a-z (inverse of +7)
  if (code >= 97 && code <= 122) {
    return String.fromCharCode(((code - 97 - 7 + 26) % 26) + 97);
  }

  // Digits 0-9 (inverse permutation)
  if (code >= 48 && code <= 57) {
    return digitInverseMap[ch] || ch;
  }

  // Space stays the same
  if (ch === ' ') {
    return ch;
  }

  // Other printable symbols: ASCII shift -3 (inverse)
  if (code >= 33 && code <= 126) {
    return String.fromCharCode(((code - 33 - 3 + 94) % 94) + 33);
  }

  // Fallback
  return ch;
}

function complexEncrypt(text) {
  let result = "";
  let mapping = {}; // original -> encrypted

  for (let ch of text) {
    const enc = encryptChar(ch);
    result += enc;
    if (!(ch in mapping)) {
      mapping[ch] = enc;
    }
  }

  return { result, mapping };
}

function complexDecrypt(text) {
  let result = "";
  for (let ch of text) {
    result += decryptChar(ch);
  }
  return result;
}

function encryptText() {
  const input = document.getElementById("inputText").value;
  const output = complexEncrypt(input);
  document.getElementById("outputText").value = output.result;
  clearExplainTable();
}

function decryptText() {
  const input = document.getElementById("inputText").value;
  const decrypted = complexDecrypt(input);
  document.getElementById("outputText").value = decrypted;
  clearExplainTable();
}

function clearExplainTable() {
  const tbody = document.getElementById("explainTableBody");
  if (tbody) {
    tbody.innerHTML = "";
  }
}

function explain() {
  const input = document.getElementById("inputText").value;
  const output = complexEncrypt(input);
  const mapping = output.mapping;

  const tbody = document.getElementById("explainTableBody");
  tbody.innerHTML = "";

  const keys = Object.keys(mapping);
  if (keys.length === 0) {
    return;
  }

  keys.forEach(ch => {
    const row = document.createElement("tr");

    const originalCell = document.createElement("td");
    originalCell.textContent = ch === " " ? "[space]" : ch;

    const encryptedCell = document.createElement("td");
    encryptedCell.textContent = mapping[ch];

    row.appendChild(originalCell);
    row.appendChild(encryptedCell);
    tbody.appendChild(row);
  });
}
