import { getDomain } from "./getDomain";
import {isProduction} from "./isProduction";

export const getConfigCoordinator = () => {
  const configCoordinator = {
    nodeId: isProduction()
        ? "https://node1." + getDomain()
        : getDomain() + 1,
    isCoordinator: true,
    isSubordinate: false,
    subordinates: isProduction()
        ? [`https://node2.${getDomain()}`, `https://node3.${getDomain()}`]
        : [`${getDomain()}2`, `${getDomain()}3`],
    coordinator: "",
  };

  return configCoordinator;
};

export const getConfigSubordinates = () => {
  const configSubordinates = [
    {
      nodeId: isProduction()
          ? "https://node2." + getDomain()
          : getDomain() + 2,
      isCoordinator: false,
      isSubordinate: true,
      subordinates: [],
      coordinator: isProduction()
          ? `https://node1.${getDomain()}`
          : `${getDomain()}1`,
    },
    {
      nodeId: isProduction()
          ? "https://node3." + getDomain()
          : getDomain() + 3,
      isCoordinator: false,
      isSubordinate: true,
      subordinates: [],
      coordinator: isProduction()
          ? `https://node1.${getDomain()}`
          : `${getDomain()}1`,
    },
  ];

  return configSubordinates;
};
