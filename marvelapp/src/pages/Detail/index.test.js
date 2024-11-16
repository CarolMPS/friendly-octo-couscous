import React from 'react';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Detail from './index'
import axios from "axios";

jest.mock("axios");

describe("Detail Page", () => {
  const mockHero = {
    id: 1,
    name: "Iron Man",
    description: "Genius, billionaire, playboy, philanthropist.",
    thumbnail: { path: "path/to/image", extension: "jpg" },
    stories: { available: 5 },
    series: { available: 3 },
  };

  const mockComics = [
    {
      id: 101,
      title: "Comic 1",
      thumbnail: { path: "path/to/comic1", extension: "jpg" },
    },
    {
      id: 102,
      title: "Comic 2",
      thumbnail: { path: "path/to/comic2", extension: "jpg" },
    },
  ];

  beforeEach(() => {
    axios.get.mockImplementation((url) => {
      if (url.includes("/characters/1")) {
        return Promise.resolve({ data: { data: { results: [mockHero] } } });
      }
      if (url.includes("/comics")) {
        return Promise.resolve({ data: { data: { results: mockComics } } });
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deveria renderizar os detalhes", async () => {
    render(
      <MemoryRouter initialEntries={["/character/1"]}>
        <Routes>
          <Route path="/character/:id" element={<Detail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText("Procure por heróis")).toBeInTheDocument();

    expect(screen.getByText(/Carregando/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Iron Man")).toBeInTheDocument();
      expect(screen.getByText("Genius, billionaire, playboy, philanthropist.")).toBeInTheDocument();
    });

    expect(screen.getByText(/Últimos lançamentos/i)).toBeInTheDocument();
    expect(screen.getByText(/Comic 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Comic 2/i)).toBeInTheDocument();
  });

  it("deveria salvar favorito", async () => {
    render(
      <MemoryRouter initialEntries={["/character/1"]}>
        <Routes>
          <Route path="/character/:id" element={<Detail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Iron Man")).toBeInTheDocument();
    });

    const favoriteButton = screen.getByRole("img", { name: /favorite/i });

    // Simula favoritar o herói
    fireEvent.click(favoriteButton);
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "favoritos",
      JSON.stringify([1])
    );
  });
});
