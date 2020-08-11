import Faker from 'faker';

export type Contact = {
  name: string;
  jobTitle: string;
  address: string;
};

export const createContactListMockData = (count: number = 50): Contact[] => {
  return new Array(count).fill(0).map(() => ({
    name: `${Faker.name.firstName()} ${Faker.name.lastName()}`,
    address: `${Faker.address.city()}, ${Faker.address.country()}`,
    jobTitle: Faker.name.jobTitle(),
  }));
};

export const createContactSectionsMockData = (count: number = 50) => {
  return new Array(Math.round(count / 2)).fill(0).map(() => ({
    title: Faker.address.country(),
    data: new Array(Math.round(count / 2)).fill(0).map(() => ({
      name: `${Faker.name.firstName()} ${Faker.name.lastName()}`,
      address: `${Faker.address.city()}, ${Faker.address.country()}`,
      jobTitle: Faker.name.jobTitle(),
    })),
  }));
};
