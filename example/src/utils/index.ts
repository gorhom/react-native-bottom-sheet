import Faker from 'faker';
import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('screen');

export type Contact = {
  name: string;
  jobTitle: string;
  address: string;
};

export type Location = {
  id: string;
  name: string;
  address: string;
  photos: string[];
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

export const createLocationListMockData = (count: number = 50): Location[] => {
  return new Array(count).fill(0).map((_, index) => ({
    id: Faker.random.alphaNumeric(6),
    name: `${Faker.address.city()}`,
    address: `${Faker.address.state()}, ${Faker.address.country()}`,
    latitude: Faker.address.latitude,
    longitude: Faker.address.longitude,
    photos: Array(5)
      .fill(0)
      .map((__, _index) => Faker.image.city(SCREEN_WIDTH + index + _index)),
  }));
};
