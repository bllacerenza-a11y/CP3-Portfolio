import aetherDiagram from '../assets/aether-diagram.svg';
import melodiaCapture from '../assets/melodia-real-desktop.png';

/** Conteúdo editorial factual; Project continua sendo obtido pela API. */
export const portfolio = {
  name: 'Bruno Bastos',
  github: 'https://github.com/bllacerenza-a11y',
  introduction: 'Estudante de Engenharia de Software na FIAP, no primeiro ano.',
  about:
    'Estou no início da minha formação em Engenharia de Software na FIAP. Este portfólio reúne projetos selecionados para acompanhar essa trajetória e compartilhar o que venho construindo em equipe.',
};

export interface EditorialMedia {
  kind: 'diagram' | 'screenshot';
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}
export interface ProjectEditorial {
  title: string;
  summary: string;
  context: string;
  note: string;
  media?: EditorialMedia;
  narrative?: {
    problem: string;
    approach: string;
    flow?: { title: string; text: string }[];
  };
}
export interface ProjectReference extends ProjectEditorial {
  owner: string;
  name: string;
}

export const selectedRepositories: ProjectReference[] = [
  {
    owner: 'bllacerenza-a11y',
    name: 'GS_AETHER_EDGE',
    title: 'Aether',
    summary:
      'Um estudo em equipe sobre monitoramento ambiental, processamento na borda e integração com a nuvem.',
    context: 'Inteligência climática',
    note: 'Projeto acadêmico em equipe.',
    media: {
      kind: 'diagram',
      src: aetherDiagram,
      width: 1000,
      height: 660,
      alt: 'Diagrama explicativo do Aether: sensores no campo, processamento na borda e conexão à nuvem.',
      caption: 'Diagrama explicativo autoral. Não é captura do sistema.',
    },
    narrative: {
      problem:
        'O README apresenta o risco de perda de dados durante desastres climáticos e falhas da infraestrutura de comunicação.',
      approach:
        'A proposta combina sensores com ESP32, processamento local e um backend Python/FastAPI. O README descreve buffer offline e recuperação dos dados após o retorno da conexão.',
      flow: [
        { title: 'Campo', text: 'Sensores coletam informações ambientais.' },
        {
          title: 'Borda',
          text: 'O nó local mantém rotinas e buffer descritos no README.',
        },
        {
          title: 'Nuvem',
          text: 'O backend recebe e processa os dados quando há conexão.',
        },
      ],
    },
  },
  {
    owner: 'bllacerenza-a11y',
    name: 'Melodia-Site-CP5-FRONTEND',
    title: 'Melodia',
    summary:
      'Uma landing page responsiva para um aplicativo fictício de música, criada em equipe.',
    context: 'Interface para a web',
    note: 'Projeto acadêmico em equipe.',
    media: {
      kind: 'screenshot',
      src: melodiaCapture,
      width: 1440,
      height: 900,
      alt: 'Captura real da abertura do Melodia, com título Sua música, sua forma, fotografia de estúdio e player de demonstração.',
      caption:
        'Captura real da demonstração pública. Foto de estúdio: Los Muertos Crew/Pexels, conforme README.',
    },
    narrative: {
      problem:
        'Apresentar a proposta de um aplicativo de música de forma clara, convidativa e adaptada a diferentes telas.',
      approach:
        'A página reúne benefícios, funcionalidades, demonstração de áudio e navegação adaptada. O formulário é demonstrativo: não envia nem armazena e-mails.',
    },
  },
];

export const privateCollaborations = [
  {
    owner: 'PedroOliDev',
    name: 'SmartCameraStudy',
    title: 'SmartCameraStudy',
    summary:
      'Colaboração em repositório privado. O código e os materiais do projeto não estão publicados neste portfólio.',
  },
] as const;
export const githubOwner = 'bllacerenza-a11y';
