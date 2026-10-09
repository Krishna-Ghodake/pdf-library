import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function appendToDoc1() {
  const filePath = path.resolve('public/pdfs/java-wt.pdf');
  const existingPdfBytes = fs.readFileSync(filePath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const monoFont = await pdfDoc.embedFont(StandardFonts.Courier);

  const pageWidth = 595.28;
  const pageHeight = 841.89;

  // Page 42: Slip 12 Header, Directory Tree, Indoor.java and Outdoor.java
  const p1 = pdfDoc.addPage([pageWidth, pageHeight]);

  let y = pageHeight - 50;

  p1.drawText('Slip12:', {
    x: 50,
    y: y,
    size: 13,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  y -= 22;
  p1.drawText('1. Write a package game which will have 2 classes Indoor & Outdoor. Use a function display () to', {
    x: 50,
    y: y,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  y -= 15;
  p1.drawText('generate the list of players for the specific game. Use default & parameterized constructor.', {
    x: 50,
    y: y,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  y -= 22;
  const treeLines = [
    'Seat_NO/',
    '|',
    '+-- game/',
    '|   +-- Indoor.java',
    '|   \\-- Outdoor.java',
    '|',
    '\\-- Slip12_1.java',
  ];

  treeLines.forEach((line) => {
    p1.drawText(line, {
      x: 50,
      y: y,
      size: 9.5,
      font: monoFont,
      color: rgb(0.1, 0.1, 0.1),
    });
    y -= 13;
  });

  y -= 10;
  p1.drawText('//Indoor.java', {
    x: 50,
    y: y,
    size: 10,
    font: boldFont,
    color: rgb(0.2, 0.2, 0.2),
  });

  y -= 15;
  const indoorCode = [
    'package game;',
    'public class Indoor {',
    '    String game;',
    '    Indoor() {',
    '        game = "Chess";',
    '    }',
    '    Indoor(String g) {',
    '        game = g;',
    '    }',
    '    public void display() {',
    '        System.out.println("Indoor Game: " + game);',
    '        System.out.println("Players: 2");',
    '    }',
    '}',
  ];

  indoorCode.forEach((line) => {
    p1.drawText(line, {
      x: 50,
      y: y,
      size: 9.5,
      font: monoFont,
      color: rgb(0, 0, 0),
    });
    y -= 14;
  });

  y -= 15;
  p1.drawText('//Outdoor.java', {
    x: 50,
    y: y,
    size: 10,
    font: boldFont,
    color: rgb(0.2, 0.2, 0.2),
  });

  y -= 15;
  const outdoorCode = [
    'package game;',
    'public class Outdoor {',
    '    String game;',
    '    Outdoor() {',
    '        game = "Cricket";',
    '    }',
    '    Outdoor(String g) {',
    '        game = g;',
    '    }',
    '    public void display() {',
    '        System.out.println("Outdoor Game: " + game);',
    '        System.out.println("Players: 11");',
    '    }',
    '}',
  ];

  outdoorCode.forEach((line) => {
    p1.drawText(line, {
      x: 50,
      y: y,
      size: 9.5,
      font: monoFont,
      color: rgb(0, 0, 0),
    });
    y -= 14;
  });

  // Page 43: Slip12_1.java and Slip12_2.html
  const p2 = pdfDoc.addPage([pageWidth, pageHeight]);
  y = pageHeight - 50;

  p2.drawText('//Slip12_1.java', {
    x: 50,
    y: y,
    size: 10,
    font: boldFont,
    color: rgb(0.2, 0.2, 0.2),
  });

  y -= 15;
  const mainCode = [
    'import game.*;',
    '',
    'class Slip12_1 {',
    '    public static void main(String args[]) {',
    '        Indoor i = new Indoor("Carrom");',
    '        Outdoor o = new Outdoor("Football");',
    '        i.display();',
    '        o.display();',
    '    }',
    '}',
  ];

  mainCode.forEach((line) => {
    p2.drawText(line, {
      x: 50,
      y: y,
      size: 9.5,
      font: monoFont,
      color: rgb(0, 0, 0),
    });
    y -= 14;
  });

  y -= 25;
  p2.drawText('2. Write a JavaScript program using an arrow function to calculate the total price of a product.', {
    x: 50,
    y: y,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  y -= 15;
  p2.drawText('Display the bill using template literals and string interpolation.', {
    x: 50,
    y: y,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  y -= 20;
  p2.drawText('//Slip12_2.html', {
    x: 50,
    y: y,
    size: 10,
    font: boldFont,
    color: rgb(0.2, 0.2, 0.2),
  });

  y -= 15;
  const htmlCode = [
    '<!DOCTYPE html>',
    '<html>',
    '<body>',
    '<script>',
    'const total = (price, qty) => price * qty;',
    'const product = "Pen";',
    'const price = 20;',
    'const qty = 5;',
    'document.write(`',
    'Product : ${product}<br>',
    'Price   : ${price}<br>',
    'Quantity: ${qty}<br>',
    'Total   : ${total(price, qty)}',
    '`);',
    '</script>',
    '</body>',
    '</html>',
  ];

  htmlCode.forEach((line) => {
    p2.drawText(line, {
      x: 50,
      y: y,
      size: 9.5,
      font: monoFont,
      color: rgb(0, 0, 0),
    });
    y -= 14;
  });

  const updatedBytes = await pdfDoc.save();
  fs.writeFileSync(filePath, updatedBytes);
  // Also update java-practical.pdf alias
  fs.writeFileSync(path.resolve('public/pdfs/java-practical.pdf'), updatedBytes);
  console.log(`Updated java-wt.pdf: now ${pdfDoc.getPageCount()} pages`);
}

async function appendToDoc2() {
  const filePath = path.resolve('public/pdfs/f-java-wt.pdf');
  const existingPdfBytes = fs.readFileSync(filePath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const monoFont = await pdfDoc.embedFont(StandardFonts.Courier);

  const pageWidth = 595.92;
  const pageHeight = 842.88;

  // Page 31: Slip 12 - Java (Practical Exam Solutions style)
  const p1 = pdfDoc.addPage([pageWidth, pageHeight]);

  let y = pageHeight - 50;

  p1.drawText('Slip 12 - Java', {
    x: 50,
    y: y,
    size: 16,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });

  y -= 15;
  p1.drawLine({
    start: { x: 50, y: y },
    end: { x: pageWidth - 50, y: y },
    thickness: 0.8,
    color: rgb(0.7, 0.7, 0.7),
  });

  y -= 25;
  p1.drawText('Ubuntu Steps:', {
    x: 50,
    y: y,
    size: 10.5,
    font: boldFont,
    color: rgb(0.2, 0.2, 0.2),
  });

  y -= 15;
  p1.drawText('1. mkdir -p game && gedit game/Indoor.java game/Outdoor.java Slip12_1.java', {
    x: 50,
    y: y,
    size: 9.5,
    font: monoFont,
    color: rgb(0.25, 0.25, 0.25),
  });

  y -= 14;
  p1.drawText('2. javac game/*.java Slip12_1.java -> java Slip12_1', {
    x: 50,
    y: y,
    size: 9.5,
    font: monoFont,
    color: rgb(0.25, 0.25, 0.25),
  });

  y -= 25;
  p1.drawText('Write a package game with 2 classes Indoor & Outdoor. Use function display() to list players.', {
    x: 50,
    y: y,
    size: 10,
    font: font,
    color: rgb(0.2, 0.2, 0.2),
  });

  y -= 20;
  const p1Code = [
    '// Indoor.java (Inside game/ directory)',
    'package game;',
    'public class Indoor {',
    '    String game;',
    '    public Indoor() { game = "Chess"; }',
    '    public Indoor(String g) { game = g; }',
    '    public void display() {',
    '        System.out.println("Indoor Game: " + game + " | Players: 2");',
    '    }',
    '}',
    '',
    '// Outdoor.java (Inside game/ directory)',
    'package game;',
    'public class Outdoor {',
    '    String game;',
    '    public Outdoor() { game = "Cricket"; }',
    '    public Outdoor(String g) { game = g; }',
    '    public void display() {',
    '        System.out.println("Outdoor Game: " + game + " | Players: 11");',
    '    }',
    '}',
    '',
    '// Slip12_1.java (Main file in Seat_NO/)',
    'import game.*;',
    'class Slip12_1 {',
    '    public static void main(String args[]) {',
    '        Indoor i = new Indoor("Carrom");',
    '        Outdoor o = new Outdoor("Football");',
    '        i.display();',
    '        o.display();',
    '    }',
    '}',
  ];

  p1Code.forEach((line) => {
    p1.drawText(line, {
      x: 50,
      y: y,
      size: 9,
      font: monoFont,
      color: line.startsWith('//') ? rgb(0.4, 0.4, 0.4) : rgb(0, 0, 0),
    });
    y -= 13.5;
  });

  // Footer for p1
  p1.drawText('Practical Manual', {
    x: 50,
    y: 35,
    size: 8.5,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });
  p1.drawText(`Page 31`, {
    x: pageWidth - 90,
    y: 35,
    size: 8.5,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });

  // Page 32: Slip 12 - Web Technology
  const p2 = pdfDoc.addPage([pageWidth, pageHeight]);
  y = pageHeight - 50;

  p2.drawText('Slip 12 - Web Technology', {
    x: 50,
    y: y,
    size: 16,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });

  y -= 15;
  p2.drawLine({
    start: { x: 50, y: y },
    end: { x: pageWidth - 50, y: y },
    thickness: 0.8,
    color: rgb(0.7, 0.7, 0.7),
  });

  y -= 25;
  p2.drawText('Ubuntu Steps:', {
    x: 50,
    y: y,
    size: 10.5,
    font: boldFont,
    color: rgb(0.2, 0.2, 0.2),
  });

  y -= 15;
  p2.drawText('1. gedit Slip12_2.html -> Open in browser: firefox Slip12_2.html', {
    x: 50,
    y: y,
    size: 9.5,
    font: monoFont,
    color: rgb(0.25, 0.25, 0.25),
  });

  y -= 25;
  p2.drawText('JavaScript program using arrow function to calculate product total and print via template literals.', {
    x: 50,
    y: y,
    size: 10,
    font: font,
    color: rgb(0.2, 0.2, 0.2),
  });

  y -= 25;
  const p2Code = [
    '<!DOCTYPE html>',
    '<html>',
    '<head>',
    '    <title>Slip 12 - Product Bill</title>',
    '    <style>',
    '        body { font-family: Arial, sans-serif; padding: 20px; }',
    '        .bill-card { border: 1px solid #ccc; padding: 15px; width: 280px; }',
    '    </style>',
    '</head>',
    '<body>',
    '    <h3>Product Invoice</h3>',
    '    <div class="bill-card">',
    '    <script>',
    '        // Arrow function for total calculation',
    '        const total = (price, qty) => price * qty;',
    '        const product = "Pen";',
    '        const price = 20;',
    '        const qty = 5;',
    '',
    '        // String interpolation with template literals',
    '        document.write(`',
    '            <p><strong>Product:</strong> ${product}</p>',
    '            <p><strong>Price:</strong> Rs. ${price}</p>',
    '            <p><strong>Quantity:</strong> ${qty}</p>',
    '            <hr>',
    '            <p><strong>Total Bill:</strong> Rs. ${total(price, qty)}</p>',
    '        `);',
    '    </script>',
    '    </div>',
    '</body>',
    '</html>',
  ];

  p2Code.forEach((line) => {
    p2.drawText(line, {
      x: 50,
      y: y,
      size: 9.5,
      font: monoFont,
      color: line.trim().startsWith('//') ? rgb(0.4, 0.4, 0.4) : rgb(0, 0, 0),
    });
    y -= 14;
  });

  // Footer for p2
  p2.drawText('Practical Manual', {
    x: 50,
    y: 35,
    size: 8.5,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });
  p2.drawText(`Page 32`, {
    x: pageWidth - 90,
    y: 35,
    size: 8.5,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });

  const updatedBytes = await pdfDoc.save();
  fs.writeFileSync(filePath, updatedBytes);
  // Also update web-technology.pdf alias
  fs.writeFileSync(path.resolve('public/pdfs/web-technology.pdf'), updatedBytes);
  console.log(`Updated f-java-wt.pdf: now ${pdfDoc.getPageCount()} pages`);
}

async function run() {
  await appendToDoc1();
  await appendToDoc2();
}

run().catch(console.error);
