import { getDomain } from "./getDomain";

export const getConfigCoordinator = () => {
  const configCoordinator = {
    nodeId: getDomain() + 1,
    isCoordinator: true,
    isSubordinate: false,
    subordinates: [`${getDomain()}2`, `${getDomain()}3`],
    coordinator: "",
  };

  return configCoordinator;
};

export const getConfigSubordinates = () => {
  const configSubordinates = [
    {
      nodeId: getDomain() + 2,
      isCoordinator: false,
      isSubordinate: true,
      subordinates: [],
      coordinator: `${getDomain()}1`,
    },
    {
      nodeId: getDomain() + 3,
      isCoordinator: false,
      isSubordinate: true,
      subordinates: [],
      coordinator: `${getDomain()}1`,
    },
  ];

  return configSubordinates;
};
