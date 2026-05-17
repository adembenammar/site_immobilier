export const mainNavigation = [
  {
    label: "Acheter",
    href: "/properties?transactionType=sale",
    sections: [
      {
        title: "Particuliers",
        links: ["Proprietes a l'achat", "Programmes neufs", "Proprietes & chateaux", "Penthouses"]
      },
      {
        title: "Destinations",
        links: ["Paris", "Nice", "Lyon", "Bordeaux"]
      }
    ]
  },
  {
    label: "Louer",
    href: "/properties?transactionType=rent",
    sections: [
      {
        title: "Locations",
        links: ["Locations longue duree", "Locations saisonnieres", "Sejours premium"]
      },
      {
        title: "Selection",
        links: ["Appartements", "Maisons", "Biens meublés"]
      }
    ]
  },
  {
    label: "À propos de nous",
    href: "/about",
    sections: [
      {
        title: "Notre maison",
        links: ["Notre histoire", "Notre équipe", "Nos valeurs", "Nos engagements"]
      },
      {
        title: "Présence",
        links: ["Nos agences", "Zones d'activité", "Partenaires", "Nous contacter"]
      }
    ]
  },
  {
    label: "Nos services",
    href: "/services",
    sections: [
      {
        title: "Conseil",
        links: ["Gestion locative", "Valorisation", "Selection acquereurs"]
      },
      {
        title: "Art de vivre",
        links: ["Architecture d'interieur", "Design", "Conciergerie"]
      }
    ]
  }
];
