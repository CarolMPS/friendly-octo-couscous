import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Lista from "./Lista";
import axios from "axios";

jest.mock("axios");

describe("Lista Component", () => {
  const mockHeroes = [
    {
      id: 1,
      name: "Iron Man",
      thumbnail: { path: "https://path.to/image", extension: "jpg" },
    },
    {
      id: 2,
      name: "Spider Man",
      thumbnail: { path: "https://path.to/image", extension: "jpg" },
    },
  ];

  const mockFavorites = [1];

  const mockAdicionaFavorito = jest.fn();
  const mockHandleAmount = jest.fn();

  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: { data: { results: mockHeroes } },
    });
  });

  it("deve renderizar a lista de heróis", async () => {
    render(
      <Lista
        search="Iron"
        order="name"
        adicionarFavorito={mockAdicionaFavorito}
        favoritos={mockFavorites}
        showFavorites="Todos os heróis"
        amountOf={10}
        handleAmount={mockHandleAmount}
      />
    );

    expect(screen.getByText(/Carregando/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Iron Man")).toBeInTheDocument();
      expect(screen.getByText("Spider Man")).toBeInTheDocument();
    });

    expect(screen.getByText("Ver mais")).toBeInTheDocument();
  });

  it("deve filtrar os heróis favoritos", async () => {
    render(
      <Lista
        search="Iron"
        order="name"
        adicionarFavorito={mockAdicionaFavorito}
        favoritos={mockFavorites}
        showFavorites="Favoritos"
        amountOf={10}
        handleAmount={mockHandleAmount}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Iron Man")).toBeInTheDocument();
      expect(screen.queryByText("Spider Man")).not.toBeInTheDocument();
    });
  });

  it("deve chamar handleAmount quando o botão 'Ver mais' for clicado", async () => {
    render(
      <Lista
        search="Iron"
        order="name"
        adicionarFavorito={mockAdicionaFavorito}
        favoritos={mockFavorites}
        showFavorites="Todos os heróis"
        amountOf={10}
        handleAmount={mockHandleAmount}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Iron Man")).toBeInTheDocument();
      expect(screen.getByText("Spider Man")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Ver mais"));

    expect(mockHandleAmount).toHaveBeenCalledTimes(1);
  });
});
