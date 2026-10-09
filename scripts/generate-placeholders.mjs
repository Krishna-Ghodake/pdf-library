import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function createJavaPdf() {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);
  const monoFont = await doc.embedFont(StandardFonts.Courier);

  // Helper to add header/footer
  const addHeaderFooter = (page, pageNum, totalPages) => {
    const { width, height } = page.getSize();
    page.drawText('Java Practical Programs — Lab Manual', {
      x: 50,
      y: height - 35,
      size: 9,
      font: font,
      color: rgb(0.4, 0.4, 0.4),
    });
    page.drawLine({
      start: { x: 50, y: height - 42 },
      end: { x: width - 50, y: height - 42 },
      thickness: 0.5,
      color: rgb(0.8, 0.8, 0.8),
    });
    page.drawText(`Page ${pageNum} of ${totalPages}`, {
      x: width - 110,
      y: 30,
      size: 9,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    });
  };

  // Page 1: Overview & Notice
  const p1 = doc.addPage([595.28, 841.89]); // A4
  p1.drawText('Java Practical Programs', {
    x: 50,
    y: 750,
    size: 24,
    font: boldFont,
    color: rgb(0.1, 0.15, 0.3),
  });
  p1.drawText('Department of Computer Science & Engineering — Practical Reference', {
    x: 50,
    y: 725,
    size: 11,
    font: font,
    color: rgb(0.4, 0.4, 0.4),
  });

  // Notice Banner
  p1.drawRectangle({
    x: 50,
    y: 630,
    width: 495,
    height: 70,
    color: rgb(0.96, 0.97, 1.0),
    borderColor: rgb(0.2, 0.4, 0.8),
    borderWidth: 1,
  });
  p1.drawText('PLACEHOLDER DOCUMENT NOTICE', {
    x: 65,
    y: 678,
    size: 11,
    font: boldFont,
    color: rgb(0.1, 0.3, 0.7),
  });
  p1.drawText('This is a verified placeholder document. To replace it with your actual PDF file,', {
    x: 65,
    y: 660,
    size: 10,
    font: font,
    color: rgb(0.2, 0.2, 0.2),
  });
  p1.drawText('save your original PDF as "public/pdfs/java-practical.pdf" in your project directory.', {
    x: 65,
    y: 645,
    size: 10,
    font: boldFont,
    color: rgb(0.2, 0.2, 0.2),
  });

  p1.drawText('Table of Practical Programs:', {
    x: 50,
    y: 590,
    size: 14,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });

  const programs = [
    '1. Multithreading & Synchronization in Java (Producer-Consumer)',
    '2. TCP/IP Socket Programming (Client-Server Architecture)',
    '3. JDBC Database Connectivity & Transaction Processing',
    '4. Java Collections Framework & Custom Comparators',
    '5. Functional Programming with Java Stream API & Lambdas',
  ];

  programs.forEach((prog, i) => {
    p1.drawText(prog, {
      x: 65,
      y: 550 - i * 30,
      size: 11,
      font: font,
      color: rgb(0.2, 0.2, 0.2),
    });
  });

  // Page 2: Program 1
  const p2 = doc.addPage([595.28, 841.89]);
  p2.drawText('Program 1: Multithreading & Synchronization', {
    x: 50,
    y: 750,
    size: 16,
    font: boldFont,
    color: rgb(0.1, 0.2, 0.4),
  });
  p2.drawText('Objective: Implement thread synchronization using wait() and notify() mechanisms.', {
    x: 50,
    y: 725,
    size: 10,
    font: font,
    color: rgb(0.3, 0.3, 0.3),
  });

  const code1 = [
    'public class ThreadSyncDemo {',
    '    private static final Object lock = new Object();',
    '    private static int buffer = 0;',
    '    private static boolean hasData = false;',
    '',
    '    public static void main(String[] args) throws InterruptedException {',
    '        Thread producer = new Thread(() -> {',
    '            for (int i = 1; i <= 5; i++) {',
    '                synchronized (lock) {',
    '                    while (hasData) {',
    '                        try { lock.wait(); } catch (InterruptedException e) {}',
    '                    }',
    '                    buffer = i;',
    '                    System.out.println("Produced item: " + buffer);',
    '                    hasData = true;',
    '                    lock.notify();',
    '                }',
    '            }',
    '        });',
    '',
    '        Thread consumer = new Thread(() -> {',
    '            for (int i = 1; i <= 5; i++) {',
    '                synchronized (lock) {',
    '                    while (!hasData) {',
    '                        try { lock.wait(); } catch (InterruptedException e) {}',
    '                    }',
    '                    System.out.println("Consumed item: " + buffer);',
    '                    hasData = false;',
    '                    lock.notify();',
    '                }',
    '            }',
    '        });',
    '',
    '        producer.start();',
    '        consumer.start();',
    '        producer.join();',
    '        consumer.join();',
    '    }',
    '}',
  ];

  p2.drawRectangle({
    x: 50,
    y: 190,
    width: 495,
    height: 520,
    color: rgb(0.97, 0.98, 0.99),
    borderColor: rgb(0.85, 0.88, 0.92),
    borderWidth: 1,
  });

  code1.forEach((line, i) => {
    p2.drawText(line, {
      x: 65,
      y: 690 - i * 14.5,
      size: 9.5,
      font: monoFont,
      color: rgb(0.15, 0.15, 0.2),
    });
  });

  // Page 3: Program 2
  const p3 = doc.addPage([595.28, 841.89]);
  p3.drawText('Program 2: TCP/IP Client-Server Socket Communication', {
    x: 50,
    y: 750,
    size: 16,
    font: boldFont,
    color: rgb(0.1, 0.2, 0.4),
  });
  p3.drawText('Objective: Create a bidirectional communication channel between client and server.', {
    x: 50,
    y: 725,
    size: 10,
    font: font,
    color: rgb(0.3, 0.3, 0.3),
  });

  const code2 = [
    'import java.io.*;',
    'import java.net.*;',
    '',
    'public class EchoServer {',
    '    public static void main(String[] args) throws IOException {',
    '        int port = 8080;',
    '        try (ServerSocket serverSocket = new ServerSocket(port)) {',
    '            System.out.println("Server listening on port " + port);',
    '            while (true) {',
    '                Socket socket = serverSocket.accept();',
    '                System.out.println("Client connected: " + socket.getInetAddress());',
    '                BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));',
    '                PrintWriter out = new PrintWriter(socket.getOutputStream(), true);',
    '                String line;',
    '                while ((line = in.readLine()) != null) {',
    '                    if ("EXIT".equalsIgnoreCase(line.trim())) break;',
    '                    out.println("ECHO: " + line);',
    '                }',
    '                socket.close();',
    '            }',
    '        }',
    '    }',
    '}',
  ];

  p3.drawRectangle({
    x: 50,
    y: 330,
    width: 495,
    height: 380,
    color: rgb(0.97, 0.98, 0.99),
    borderColor: rgb(0.85, 0.88, 0.92),
    borderWidth: 1,
  });

  code2.forEach((line, i) => {
    p3.drawText(line, {
      x: 65,
      y: 690 - i * 15,
      size: 9.5,
      font: monoFont,
      color: rgb(0.15, 0.15, 0.2),
    });
  });

  // Page 4: Program 3
  const p4 = doc.addPage([595.28, 841.89]);
  p4.drawText('Program 3: JDBC Database CRUD Operations', {
    x: 50,
    y: 750,
    size: 16,
    font: boldFont,
    color: rgb(0.1, 0.2, 0.4),
  });
  p4.drawText('Objective: Execute SQL queries using PreparedStatement and handle transactions.', {
    x: 50,
    y: 725,
    size: 10,
    font: font,
    color: rgb(0.3, 0.3, 0.3),
  });

  const code3 = [
    'import java.sql.*;',
    '',
    'public class DatabaseManager {',
    '    private static final String URL = "jdbc:postgresql://localhost:5432/university";',
    '    private static final String USER = "postgres";',
    '    private static final String PASS = "secret";',
    '',
    '    public static void insertStudent(int id, String name, double gpa) throws SQLException {',
    '        String sql = "INSERT INTO students (id, name, gpa) VALUES (?, ?, ?)";',
    '        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);',
    '             PreparedStatement stmt = conn.prepareStatement(sql)) {',
    '            stmt.setInt(1, id);',
    '            stmt.setString(2, name);',
    '            stmt.setDouble(3, gpa);',
    '            int rows = stmt.executeUpdate();',
    '            System.out.println("Inserted " + rows + " row(s) successfully.");',
    '        }',
    '    }',
    '}',
  ];

  p4.drawRectangle({
    x: 50,
    y: 380,
    width: 495,
    height: 330,
    color: rgb(0.97, 0.98, 0.99),
    borderColor: rgb(0.85, 0.88, 0.92),
    borderWidth: 1,
  });

  code3.forEach((line, i) => {
    p4.drawText(line, {
      x: 65,
      y: 690 - i * 16,
      size: 9.5,
      font: monoFont,
      color: rgb(0.15, 0.15, 0.2),
    });
  });

  // Page 5: Program 4
  const p5 = doc.addPage([595.28, 841.89]);
  p5.drawText('Program 4: Functional Programming with Java Stream API', {
    x: 50,
    y: 750,
    size: 16,
    font: boldFont,
    color: rgb(0.1, 0.2, 0.4),
  });
  p5.drawText('Objective: Filter, map, and aggregate dataset using Java Stream pipeline.', {
    x: 50,
    y: 725,
    size: 10,
    font: font,
    color: rgb(0.3, 0.3, 0.3),
  });

  const code4 = [
    'import java.util.*;',
    'import java.util.stream.Collectors;',
    '',
    'public class StreamApiDemo {',
    '    record Student(String name, String department, double score) {}',
    '',
    '    public static void main(String[] args) {',
    '        List<Student> roster = List.of(',
    '            new Student("Alice", "CS", 92.5),',
    '            new Student("Bob", "IT", 85.0),',
    '            new Student("Charlie", "CS", 88.0),',
    '            new Student("Diana", "ECE", 95.0)',
    '        );',
    '',
    '        List<String> topPerformers = roster.stream()',
    '            .filter(s -> s.score() >= 90.0)',
    '            .sorted(Comparator.comparingDouble(Student::score).reversed())',
    '            .map(s -> s.name() + " (" + s.department() + "): " + s.score())',
    '            .collect(Collectors.toList());',
    '',
    '        topPerformers.forEach(System.out::println);',
    '    }',
    '}',
  ];

  p5.drawRectangle({
    x: 50,
    y: 350,
    width: 495,
    height: 360,
    color: rgb(0.97, 0.98, 0.99),
    borderColor: rgb(0.85, 0.88, 0.92),
    borderWidth: 1,
  });

  code4.forEach((line, i) => {
    p5.drawText(line, {
      x: 65,
      y: 690 - i * 15,
      size: 9.5,
      font: monoFont,
      color: rgb(0.15, 0.15, 0.2),
    });
  });

  // Add header & footer to all 5 pages
  const pages = doc.getPages();
  pages.forEach((p, index) => {
    addHeaderFooter(p, index + 1, pages.length);
  });

  const pdfBytes = await doc.save();
  fs.writeFileSync(path.resolve('public/pdfs/java-practical.pdf'), pdfBytes);
  console.log('Created public/pdfs/java-practical.pdf (5 pages)');
}

async function createWebTechPdf() {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);
  const monoFont = await doc.embedFont(StandardFonts.Courier);

  const addHeaderFooter = (page, pageNum, totalPages) => {
    const { width, height } = page.getSize();
    page.drawText('Web Technology Practical Programs — Lab Manual', {
      x: 50,
      y: height - 35,
      size: 9,
      font: font,
      color: rgb(0.4, 0.4, 0.4),
    });
    page.drawLine({
      start: { x: 50, y: height - 42 },
      end: { x: width - 50, y: height - 42 },
      thickness: 0.5,
      color: rgb(0.8, 0.8, 0.8),
    });
    page.drawText(`Page ${pageNum} of ${totalPages}`, {
      x: width - 110,
      y: 30,
      size: 9,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    });
  };

  // Page 1: Overview & Notice
  const p1 = doc.addPage([595.28, 841.89]);
  p1.drawText('Web Technology Practical Programs', {
    x: 50,
    y: 750,
    size: 24,
    font: boldFont,
    color: rgb(0.05, 0.25, 0.35),
  });
  p1.drawText('Full-Stack Web Development & Modern JavaScript Standards', {
    x: 50,
    y: 725,
    size: 11,
    font: font,
    color: rgb(0.4, 0.4, 0.4),
  });

  // Notice Banner
  p1.drawRectangle({
    x: 50,
    y: 630,
    width: 495,
    height: 70,
    color: rgb(0.95, 0.99, 0.98),
    borderColor: rgb(0.1, 0.6, 0.5),
    borderWidth: 1,
  });
  p1.drawText('PLACEHOLDER DOCUMENT NOTICE', {
    x: 65,
    y: 678,
    size: 11,
    font: boldFont,
    color: rgb(0.08, 0.45, 0.38),
  });
  p1.drawText('This is a verified placeholder document. To replace it with your actual PDF file,', {
    x: 65,
    y: 660,
    size: 10,
    font: font,
    color: rgb(0.2, 0.2, 0.2),
  });
  p1.drawText('save your original PDF as "public/pdfs/web-technology.pdf" in your project directory.', {
    x: 65,
    y: 645,
    size: 10,
    font: boldFont,
    color: rgb(0.2, 0.2, 0.2),
  });

  p1.drawText('Table of Practical Programs:', {
    x: 50,
    y: 590,
    size: 14,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });

  const programs = [
    '1. Responsive Multi-Column Layout using CSS Grid and Flexbox',
    '2. Dynamic Form Validation and Asynchronous DOM Updates',
    '3. RESTful API Client with Fetch API, Async/Await and Error Handling',
    '4. Client-Side Persistent State Management using Web Storage API',
    '5. Interactive Single Page Canvas Graphics & Charting Visualizer',
  ];

  programs.forEach((prog, i) => {
    p1.drawText(prog, {
      x: 65,
      y: 550 - i * 30,
      size: 11,
      font: font,
      color: rgb(0.2, 0.2, 0.2),
    });
  });

  // Page 2: Lab 1
  const p2 = doc.addPage([595.28, 841.89]);
  p2.drawText('Lab 1: Modern CSS Grid and Flexbox Architecture', {
    x: 50,
    y: 750,
    size: 16,
    font: boldFont,
    color: rgb(0.05, 0.25, 0.35),
  });
  p2.drawText('Objective: Build a fully responsive fluid card grid without hardcoded media queries.', {
    x: 50,
    y: 725,
    size: 10,
    font: font,
    color: rgb(0.3, 0.3, 0.3),
  });

  const code1 = [
    '/* Modern Responsive Grid without Breakpoints */',
    '.card-grid {',
    '  display: grid;',
    '  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));',
    '  gap: 1.5rem;',
    '  padding: 2rem;',
    '}',
    '',
    '.card {',
    '  display: flex;',
    '  flex-direction: column;',
    '  background: #ffffff;',
    '  border: 1px solid rgba(0, 0, 0, 0.08);',
    '  border-radius: 12px;',
    '  padding: 1.5rem;',
    '  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);',
    '  transition: transform 0.2s ease, box-shadow 0.2s ease;',
    '}',
    '',
    '.card:hover {',
    '  transform: translateY(-2px);',
    '  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);',
    '}',
  ];

  p2.drawRectangle({
    x: 50,
    y: 350,
    width: 495,
    height: 360,
    color: rgb(0.97, 0.99, 0.98),
    borderColor: rgb(0.85, 0.92, 0.9),
    borderWidth: 1,
  });

  code1.forEach((line, i) => {
    p2.drawText(line, {
      x: 65,
      y: 690 - i * 16,
      size: 9.5,
      font: monoFont,
      color: rgb(0.15, 0.2, 0.2),
    });
  });

  // Page 3: Lab 2
  const p3 = doc.addPage([595.28, 841.89]);
  p3.drawText('Lab 2: Dynamic Form Validation and Event Delegation', {
    x: 50,
    y: 750,
    size: 16,
    font: boldFont,
    color: rgb(0.05, 0.25, 0.35),
  });
  p3.drawText('Objective: Perform instant real-time field validation with custom regex rules.', {
    x: 50,
    y: 725,
    size: 10,
    font: font,
    color: rgb(0.3, 0.3, 0.3),
  });

  const code2 = [
    'function validateRegistrationForm(formData) {',
    '    const errors = {};',
    '    const emailRegex = /^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/ ;',
    '    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$/ ;',
    '',
    '    if (!formData.username || formData.username.trim().length < 3) {',
    '        errors.username = "Username must be at least 3 characters long.";',
    '    }',
    '    if (!emailRegex.test(formData.email)) {',
    '        errors.email = "Please provide a valid email address.";',
    '    }',
    '    if (!passwordRegex.test(formData.password)) {',
    '        errors.password = "Password must be at least 8 chars with 1 number.";',
    '    }',
    '',
    '    return {',
    '        isValid: Object.keys(errors).length === 0,',
    '        errors',
    '    };',
    '}',
  ];

  p3.drawRectangle({
    x: 50,
    y: 380,
    width: 495,
    height: 330,
    color: rgb(0.97, 0.99, 0.98),
    borderColor: rgb(0.85, 0.92, 0.9),
    borderWidth: 1,
  });

  code2.forEach((line, i) => {
    p3.drawText(line, {
      x: 65,
      y: 690 - i * 16,
      size: 9.5,
      font: monoFont,
      color: rgb(0.15, 0.2, 0.2),
    });
  });

  // Page 4: Lab 3
  const p4 = doc.addPage([595.28, 841.89]);
  p4.drawText('Lab 3: Asynchronous Fetch API & JSON Processing', {
    x: 50,
    y: 750,
    size: 16,
    font: boldFont,
    color: rgb(0.05, 0.25, 0.35),
  });
  p4.drawText('Objective: Fetch paginated REST data with retry logic and error resilience.', {
    x: 50,
    y: 725,
    size: 10,
    font: font,
    color: rgb(0.3, 0.3, 0.3),
  });

  const code3 = [
    'async function fetchWithRetry(url, options = {}, retries = 3) {',
    '    for (let attempt = 1; attempt <= retries; attempt++) {',
    '        try {',
    '            const response = await fetch(url, {',
    '                ...options,',
    '                headers: { "Content-Type": "application/json", ...options.headers },',
    '            });',
    '            if (!response.ok) {',
    '                throw new Error(`HTTP error status: ${response.status}`);',
    '            }',
    '            return await response.json();',
    '        } catch (err) {',
    '            if (attempt === retries) throw err;',
    '            const backoff = Math.pow(2, attempt) * 100;',
    '            await new Promise(res => setTimeout(res, backoff));',
    '        }',
    '    }',
    '}',
  ];

  p4.drawRectangle({
    x: 50,
    y: 360,
    width: 495,
    height: 350,
    color: rgb(0.97, 0.99, 0.98),
    borderColor: rgb(0.85, 0.92, 0.9),
    borderWidth: 1,
  });

  code3.forEach((line, i) => {
    p4.drawText(line, {
      x: 65,
      y: 690 - i * 16,
      size: 9.5,
      font: monoFont,
      color: rgb(0.15, 0.2, 0.2),
    });
  });

  // Page 5: Lab 4
  const p5 = doc.addPage([595.28, 841.89]);
  p5.drawText('Lab 4: LocalStorage & Client-Side Session Cache', {
    x: 50,
    y: 750,
    size: 16,
    font: boldFont,
    color: rgb(0.05, 0.25, 0.35),
  });
  p5.drawText('Objective: Implement offline cache with TTL expiration.', {
    x: 50,
    y: 725,
    size: 10,
    font: font,
    color: rgb(0.3, 0.3, 0.3),
  });

  const code4 = [
    'class StorageCache {',
    '    static set(key, value, ttlSeconds = 3600) {',
    '        const record = {',
    '            value,',
    '            expiresAt: Date.now() + ttlSeconds * 1000,',
    '        };',
    '        localStorage.setItem(key, JSON.stringify(record));',
    '    }',
    '',
    '    static get(key) {',
    '        const raw = localStorage.getItem(key);',
    '        if (!raw) return null;',
    '        const record = JSON.parse(raw);',
    '        if (Date.now() > record.expiresAt) {',
    '            localStorage.removeItem(key);',
    '            return null;',
    '        }',
    '        return record.value;',
    '    }',
    '}',
  ];

  p5.drawRectangle({
    x: 50,
    y: 360,
    width: 495,
    height: 350,
    color: rgb(0.97, 0.99, 0.98),
    borderColor: rgb(0.85, 0.92, 0.9),
    borderWidth: 1,
  });

  code4.forEach((line, i) => {
    p5.drawText(line, {
      x: 65,
      y: 690 - i * 16,
      size: 9.5,
      font: monoFont,
      color: rgb(0.15, 0.2, 0.2),
    });
  });

  const pages = doc.getPages();
  pages.forEach((p, index) => {
    addHeaderFooter(p, index + 1, pages.length);
  });

  const pdfBytes = await doc.save();
  fs.writeFileSync(path.resolve('public/pdfs/web-technology.pdf'), pdfBytes);
  console.log('Created public/pdfs/web-technology.pdf (5 pages)');
}

async function run() {
  await createJavaPdf();
  await createWebTechPdf();
}

run().catch(console.error);
