import { useEffect } from "react";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";

export interface SpaceDictionary {
  error: {
    _default: {
      title: string;
      desc: string;
      retry: string;
    };
  };
  poll: {
    result: {
      choiceHeader: string;
      countHeader: string;
      update: string;
    };
  };
  quorum: {
    liveLabel: string;
    saveLabel: string;
    atLabel: string;
    liveUserCount: string;
    liveVoteCount: string;
    totalVoteCount: string;
  };
}

export const defaultSpaceDictionary: Record<"en" | "fr", SpaceDictionary> = {
  en: {
    error: {
      _default: {
        title: "Oops: an error occurred",
        desc: "If the problem persist, please reload or contact the support",
        retry: "Retry",
      },
    },
    poll: {
      result: {
        choiceHeader: "choice",
        countHeader: "voice count",
        update: "Update",
      },
    },
    quorum: {
      saveLabel: "Save Quorum",
      liveLabel: "Live",
      atLabel: "At",
      liveUserCount: "Live Users",
      liveVoteCount: "Live Count",
      totalVoteCount: "Total Count",
    },
  },
  fr: {
    error: {
      _default: {
        title: "Oups: une erreur est survenu",
        desc:
          "Si le probleme persiste, veuillez recharger la page ou contacter le support",
        retry: "Réessayer",
      },
    },
    poll: {
      result: {
        choiceHeader: "choix",
        countHeader: "nombre de voix",
        update: "Rafraichir",
      },
    },
    quorum: {
      saveLabel: "Save Quorum",
      liveLabel: "Direct",
      atLabel: "At",
      liveUserCount: "Live Users",
      liveVoteCount: "Live Count",
      totalVoteCount: "Total Count",
    },
  },
};

const dictionaryAtom = atom<SpaceDictionary>({
  key: "space-service/dictionary",
  default: defaultSpaceDictionary.en,
});

export function useSetDictionary(dictionary: SpaceDictionary) {
  const setDictionary = useSetRecoilState(dictionaryAtom);

  useEffect(() => {
    setDictionary((d) => ({
      ...d,
      ...dictionary,
    }));
  }, [setDictionary, dictionary]);
}

export function useDictionary<K extends keyof SpaceDictionary>(
  key: K,
): SpaceDictionary[K] {
  return useRecoilValue(dictionaryAtom)[key];
}
