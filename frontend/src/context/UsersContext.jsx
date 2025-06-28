import { faker } from '@faker-js/faker';



export const fakeUser1 = {

  name: faker.person.fullName(),
  email: faker.internet.email(),
  avatar: faker.image.avatar(),

};

// export const getRegisteredUsers = () =>
//   Array.from({ length: 10 }, () => ({
//     name: faker.person.fullName(),
//     email: faker.internet.email(),
//     avatar: faker.image.avatar(),
//   }));



