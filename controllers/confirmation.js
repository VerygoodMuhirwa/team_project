function generateCode() {
  let r_arr = [],
    alph_arr = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
    ],
    r1 = Math.floor(Math.random() * 10),
    r2 = Math.floor(Math.random() * 10),
    r3 = Math.floor(Math.random() * 10),
    r4 = Math.floor(Math.random() * 10),
    r5 = Math.floor(Math.random() * 26),
    r6 = Math.floor(Math.random() * 26),
    r7 = Math.floor(Math.random() * 26),
    r8 = Math.floor(Math.random() * 26),
    r9 = Math.floor(Math.random() * 8),
    r10,
    r11,
    r12,
    r13,
    r14,
    r15,
    r16;
  for (let x = 0; x < 1000; x++) {
    let r = Math.floor(Math.random() * 8);
    if (r !== r9) {
      r10 = r;
      break;
    }
  }
  for (let x = 0; x < 1000; x++) {
    let r = Math.floor(Math.random() * 8);
    if (r !== r9 && r !== r10) {
      r11 = r;
      break;
    }
  }
  for (let x = 0; x < 1000; x++) {
    let r = Math.floor(Math.random() * 8);
    if (r !== r9 && r !== r10 && r !== r11) {
      r12 = r;
      break;
    }
  }
  for (let x = 0; x < 1000; x++) {
    let r = Math.floor(Math.random() * 8);
    if (r !== r9 && r !== r10 && r !== r11 && r !== r12) {
      r13 = r;
      break;
    }
  }
  for (let x = 0; x < 1000; x++) {
    let r = Math.floor(Math.random() * 8);
    if (r !== r9 && r !== r10 && r !== r11 && r !== r12 && r !== r13) {
      r14 = r;
      break;
    }
  }
  for (let x = 0; x < 1000; x++) {
    let r = Math.floor(Math.random() * 8);
    if (
      r !== r9 &&
      r !== r10 &&
      r !== r11 &&
      r !== r12 &&
      r !== r13 &&
      r !== r14
    ) {
      r15 = r;
      break;
    }
  }
  for (let x = 0; x < 1000; x++) {
    let r = Math.floor(Math.random() * 8);
    if (
      r !== r9 &&
      r !== r10 &&
      r !== r11 &&
      r !== r12 &&
      r !== r13 &&
      r !== r14 &&
      r !== r15
    ) {
      r16 = r;
      break;
    }
  }
  r_arr[r9] = r1;
  r_arr[r10] = r2;
  r_arr[r11] = r3;
  r_arr[r12] = r4;
  r_arr[r13] = alph_arr[r5];
  r_arr[r14] = alph_arr[r6];
  r_arr[r15] = alph_arr[r7];
  r_arr[r16] = alph_arr[r8];
  let emailConfirmCode = "";
  for (let x = 0; x < 8; x++) {
    emailConfirmCode += `${r_arr[x]}`;
  }
  return emailConfirmCode;
}


generateCode()