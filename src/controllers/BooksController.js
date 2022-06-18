const { nanoid } = require('nanoid');
const books = require('../books');

exports.addBook = (req, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });

    return response.code(400);
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });

    return response.code(400);
  }

  const insertedAt = new Date().toISOString();

  const newBook = {
    id: nanoid(16),
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished: (pageCount === readPage),
    reading,
    insertedAt,
    updatedAt: insertedAt,
  };

  books.push(newBook);

  const isError = books.filter((book) => (book.id === newBook.id)).length === 0;

  if (isError) {
    const response = h.response({
      status: 'error',
      message: 'Buku gagal ditambahkan',
    });

    return response.code(500);
  }

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: newBook.id,
    },
  });

  return response.code(201);
};

exports.getAllBooks = (req, h) => {
  const { name, reading, finished } = req.query;

  let booksData = books;

  if (name) {
    booksData = booksData.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (reading) {
    booksData = booksData.filter((book) => {
      if (+reading !== 1 && +reading !== 0) {
        return book;
      }

      return book.reading === !!+reading;
    });
  }

  if (finished) {
    booksData = booksData.filter((book) => {
      if (+finished !== 1 && +finished !== 0) {
        return book;
      }

      return book.finished === !!+finished;
    });
  }

  const response = h.response({
    status: 'success',
    data: {
      books: booksData.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });

  return response.code(200);
};

exports.getBookById = (req, h) => {
  const { bookId } = req.params;

  const book = books.find((b) => b.id === bookId);

  if (!book) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });

    return response.code(404);
  }

  const response = h.response({
    status: 'success',
    data: {
      book,
    },
  });

  return response.code(200);
};

exports.editBookById = (req, h) => {
  const { bookId } = req.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });

    return response.code(404);
  }

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });

    return response.code(400);
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });

    return response.code(400);
  }

  books[bookIndex] = {
    ...books[bookIndex],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt: new Date().toISOString(),
  };

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });

  return response.code(200);
};

exports.deleteBookById = (req, h) => {
  const { bookId } = req.params;

  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });

    return response.code(404);
  }

  books.splice(bookIndex, 1);

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });

  return response.code(200);
};
