export interface ProfileData {
  date: string;
  platform: string;
  visits: number;
  linkTaps: number;
  addressTaps: number;
  follows: number;
}

export const profileData: ProfileData[] = [
  {
    date: "2024-01-01",
    platform: "instagram",
    visits: 200,
    linkTaps: 50,
    addressTaps: 30,
    follows: 20
  },
  {
    date: "2024-01-02",
    platform: "facebook",
    visits: 300,
    linkTaps: 80,
    addressTaps: 40,
    follows: 25
  },
  {
    date: "2024-01-03",
    platform: "linkedin",
    visits: 150,
    linkTaps: 40,
    addressTaps: 20,
    follows: 15
  }
];