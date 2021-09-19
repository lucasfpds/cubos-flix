const body = document.querySelector("body");
const galeriaDeFilmes = document.querySelector(".movies");
const buttonNext = document.querySelector(".btn-next");
const buttonPrev = document.querySelector(".btn-prev");
const modal = document.querySelector(".modal");
const input = document.querySelector("input");
const tema = document.querySelector(".btn-theme");
const h2 = document.querySelector("h2");
const spanMovieTitle = document.querySelectorAll(
  ".highlight__genres,.highlight__launch"
);

const divHighLight = document.querySelector(".highlight__video");
const tituloHighlight = document.querySelector(".highlight__title");
const notaHighlight = document.querySelector(".highlight__rating");
const dataHighlight = document.querySelector(".highlight__launch");
const descricaoHighlight = document.querySelector(".highlight__description");
const videoHighlight = document.querySelector(".highlight__video-link");
const generosHighlight = document.querySelector(".highlight__genres");
const infosHighlight = document.querySelector(".highlight__info");

const tituloModal = document.querySelector(".modal__title");
const imgModal = document.querySelector(".modal__img");
const descricaoModal = document.querySelector(".modal__description");
const notaModal = document.querySelector(".modal__average");
const generosModal = document.querySelector(".modal__genres");
const trailerModal = document.querySelector(".modal a");
const fecharModal = document.querySelector(".modal__close");

fetch(
  "https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false"
).then(function (response) {
  const promisseResponse = response.json();

  promisseResponse.then(function (response) {
    let inicio = 0;
    let final = 5;
    let max = 15;
    const arrayDeFilmes = response.results;
    let arrayFilmesPesquisados = [];
    let pesquisando = false;

    function exibirFilmes(filmes) {
      filmesExibidos = filmes.slice(inicio, final);

      filmesExibidos.forEach((Element) => {
        const divMovie = document.createElement("div");
        divMovie.classList.add("movie");
        divMovie.id = String(Element.id);
        divMovie.style.backgroundImage = `url(${Element.poster_path})`;
        galeriaDeFilmes.append(divMovie);

        const divMovieInfo = document.createElement("div");
        divMovieInfo.classList.add("movie__info");
        divMovie.append(divMovieInfo);

        const spanMovieTitle = document.createElement("span");
        const spanMovieRating = document.createElement("span");
        spanMovieTitle.classList.add("movie__title");
        spanMovieRating.classList.add("movie__rating");

        const tituloFilme = Element.title.slice(0, 8) + "...";
        spanMovieTitle.textContent = tituloFilme;

        const img = document.createElement("img");
        img.src = "./assets/estrela.svg";
        spanMovieRating.append(img);

        const nota = document.createElement("span");
        nota.textContent = Element.vote_average;
        spanMovieRating.append(nota);

        divMovieInfo.append(spanMovieTitle, spanMovieRating);
      });
    }

    exibirFilmes(arrayDeFilmes);

    // BUSCAR FILMES
    input.addEventListener("keydown", function (event) {
      tecla = event.key;

      // ESTÁ PESQUISANDO E O VALOR DO INPUT É VÁLIDO
      if (tecla == "Enter" && input.value != "") {
        pesquisando = true;

        fetch(
          `https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${input.value}`
        ).then(function (response) {
          const promisseResponse = response.json();

          promisseResponse.then(function (response) {
            const divs = document.querySelectorAll(".movie");

            divs.forEach((element) => {
              element.remove();
            });

            arrayFilmesPesquisados = response.results;

            inicio = 0;
            final = 5;

            const arrayTamanho = arrayFilmesPesquisados.length;

            if (arrayTamanho / 4 < 1.26) {
              max = 0;
            } else if (arrayTamanho / 4 < 2.51) {
              max = 5;
            } else if (arrayTamanho / 4 < 3.76) {
              max = 10;
            } else {
              max = 15;
            }

            exibirFilmes(arrayFilmesPesquisados);
          });
        });

        input.value = "";

        // LIMPANDO O INPUT E VOLTANDO A GALERIA DE FILMES INICIAL
      } else if (tecla == "Enter" && input.value == "") {
        pesquisando = false;
        const divs = document.querySelectorAll(".movie");

        divs.forEach((element) => {
          element.remove();
        });
        exibirFilmes(arrayDeFilmes);
      }
    });

    // BOTÃO PROXIMO
    buttonNext.addEventListener("click", function () {
      // NÃO ESTÁ PESQUISANDO
      if (!pesquisando) {
        const divs = document.querySelectorAll(".movie");
        divs.forEach((div) => {
          div.remove();
        });

        inicio += 5;
        final += 5;

        if (inicio < max + 1) {
          exibirFilmes(arrayDeFilmes);
        } else {
          inicio = 0;
          final = 5;
          exibirFilmes(arrayDeFilmes);
        }

        // ESTÁ PESQUISANDO
      } else {
        const divs = document.querySelectorAll(".movie");

        divs.forEach((element) => {
          element.remove();
        });

        inicio += 5;
        final += 5;

        if (inicio < max + 1) {
          exibirFilmes(arrayFilmesPesquisados);
        } else {
          inicio = 0;
          final = 5;
          exibirFilmes(arrayFilmesPesquisados);
        }
      }
    });

    // BOTAO ANTES
    buttonPrev.addEventListener("click", function () {
      // NÃO ESTÁ PESQUISANDO
      if (!pesquisando) {
        const divs = document.querySelectorAll(".movie");

        divs.forEach((element) => {
          element.remove();
        });

        inicio -= 5;
        final -= 5;

        if (inicio > -1) {
          exibirFilmes(arrayDeFilmes);
        } else {
          inicio = max;
          final = max + 5;
          exibirFilmes(arrayDeFilmes);
        }

        // ESTÁ PESQUISANDO
      } else {
        const divs = document.querySelectorAll(".movie");

        divs.forEach((element) => {
          element.remove();
        });

        inicio -= 5;
        final -= 5;

        if (inicio > -1) {
          exibirFilmes(arrayFilmesPesquisados);
        } else {
          inicio = max;
          final = max + 5;
          exibirFilmes(arrayFilmesPesquisados);
        }
      }
    });

    // ABRIR MODAL
    galeriaDeFilmes.addEventListener("click", function (event) {
      trailerModal.href = "";

      const id = event.target.attributes[1].value;

      fetch(
        `https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${id}?language=pt-BR`
      ).then(function (response) {
        const promisseResponse = response.json();

        promisseResponse.then(function (response) {
          const arrGeneros = response.genres;

          arrGeneros.forEach((element) => {
            const p = document.createElement("p");
            p.textContent = element.name;
            generosModal.append(p);
          });

          modal.classList.remove("hidden");

          tituloModal.textContent = response.title;
          imgModal.src = response.backdrop_path;
          descricaoModal.textContent = response.overview;
          notaModal.textContent = response.vote_average;

          // TRAILER PARA MODAL
          fetch(
            `https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${id}/videos?language=pt-BR`
          ).then(function (response) {
            const promisseResponse = response.json();

            promisseResponse.then(function (response) {
              if (response.results[0] !== undefined) {
                trailerModal.classList.remove("hidden");
                const key = response.results[0].key;
                trailerModal.href = `https://www.youtube.com/watch?v=${key}`;
              } else {
                trailerModal.classList.add("hidden");
              }
            });
          });
        });
      });
    });
  });
});

//  FILME DO DIA

fetch(
  "https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR"
).then(function (response) {
  const promisseResponse = response.json();

  promisseResponse.then(function (response) {
    //TRATAMENTO DA DATA
    const data = response.release_date;
    const arr = data.split("-");
    let mes = arr[1];

    switch (mes) {
      case "01":
        mes = "Janeiro";
        break;
      case "02":
        mes = "Fevereiro";
        break;
      case "03":
        mes = "Março";
        break;
      case "04":
        mes = "Abril";
        break;
      case "05":
        mes = "Maio";
        break;
      case "06":
        mes = "Junho";
        break;
      case "07":
        mes = "Julho";
        break;
      case "08":
        mes = "Agosto";
        break;
      case "09":
        mes = "Setembro";
        break;
      case "10":
        mes = "Outubro";
        break;
      case "11":
        mes = "Novembro";
        break;
      case "12":
        mes = "Dezembro";
        break;
    }

    arr[1] = mes;
    
    const novaData = arr.reverse().join().replaceAll(",", " de ");

    //TRATAMENTO DOS DADOS RESTANTES
    tituloHighlight.textContent = response.title;
    notaHighlight.textContent = response.vote_average;
    dataHighlight.textContent = novaData;
    descricaoHighlight.textContent = response.overview;
    divHighLight.style.background = `no-repeat center/110% url(${response.backdrop_path})`;

    arrayGeneros = response.genres;

    arrayGeneros.forEach((element, index) => {
      arrayGeneros.length - 1 !== index
        ? (generosHighlight.textContent += `${element.name}, `)
        : (generosHighlight.textContent += `${element.name} / `);
    });
  });
});

// TRAILER FILME DO DIA

fetch(
  `https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR`
).then(function (response) {
  const promisseResponse = response.json();

  promisseResponse.then(function (response) {
    const key = response.results[0].key;
    videoHighlight.href = `https://www.youtube.com/watch?v=${key}`;
    trailerModal.href = `https://www.youtube.com/watch?v=${key}`;
  });
});

// FECHAR MODAL

fecharModal.addEventListener("click", closeModal);

modal.addEventListener("click", closeModal);

imgModal.addEventListener("click", function (event) {
  event.stopPropagation();
});

trailerModal.addEventListener("click", function (event) {
  event.stopPropagation();
});

function closeModal() {
  const p = document.querySelectorAll(".modal__genres>p");

  p.forEach((element) => {
    element.remove();
  });

  modal.classList.add("hidden");
}

// TEMA NOTURNO
tema.addEventListener("click", function () {
  if (tema.src.includes("light")) {
    tema.src = "./assets/dark-mode.svg";
    input.style.background = "#242424";
    input.style.color = "#FFFFFF";
    input.style.border = "1px solid #FFFFFF";
    body.style.background = "#242424";
    infosHighlight.style.background = "#454545";
    spanMovieTitle.forEach((element) => {
      element.style.color = "rgba(255, 255, 255, 0.7)";
    });
    descricaoHighlight.style.color = "rgba(255, 255, 255, 0.7)";
    h2.style.color = "#FFFFFF";
    buttonPrev.src = "./assets/seta-esquerda-branca.svg";
    buttonNext.src = "./assets/seta-direita-branca.svg";
  } else {
    tema.src = "./assets/light-mode.svg";
    input.style.background = "#FFFFFF";
    input.style.color = "#979797";
    input.style.border = "1px solid #979797";
    body.style.background = "#E5E5E5";
    infosHighlight.style.background = "#FFFFFF";
    spanMovieTitle.forEach((element) => {
      element.style.color = "rgba(0, 0, 0, 0.7)";
    });
    descricaoHighlight.style.color = "#000000";
    h2.style.color = "#000000";
    buttonPrev.src = "./assets/seta-esquerda-preta.svg";
    buttonNext.src = "./assets/seta-direita-preta.svg";
  }
});
