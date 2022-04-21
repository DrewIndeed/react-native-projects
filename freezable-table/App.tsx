import React, { useRef, useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View, ScrollView } from 'react-native';

const testData = [
  {
    name: 'Adele Welch',
    phone: '(171) 728-6134',
    email: 'a.sollicitudin@hotmail.ca',
    address: '308-5457 Aliquet Road',
    country: 'Pakistan',
  },
  {
    name: 'Jane Rogers',
    phone: '(328) 784-5216',
    email: 'enim@protonmail.net',
    address: 'Ap #906-5694 Tempus, Avenue',
    country: 'United Kingdom',
  },
  {
    name: 'Edward Clemons',
    phone: '1-466-844-4088',
    email: 'sapien@google.couk',
    address: '7012 Faucibus Rd.',
    country: 'Nigeria',
  },
  {
    name: 'Hasad Rhodes',
    phone: '1-873-705-4222',
    email: 'a.felis.ullamcorper@google.ca',
    address: '9673 Suspendisse Ave',
    country: 'Sweden',
  },
  {
    name: 'Kaye Mcdaniel',
    phone: '(724) 466-4451',
    email: 'ornare@protonmail.net',
    address: '255-6551 Tincidunt Rd.',
    country: 'Chile',
  },
  {
    name: 'Wilma Rodriquez',
    phone: '1-868-863-1156',
    email: 'sed.consequat.auctor@protonmail.com',
    address: '955-8452 Suscipit, Street',
    country: 'Spain',
  },
  {
    name: 'Kato King',
    phone: '(353) 215-3365',
    email: 'lobortis.tellus.justo@aol.couk',
    address: 'Ap #323-9130 Id, Rd.',
    country: 'Australia',
  },
  {
    name: 'Tate West',
    phone: '(846) 658-3892',
    email: 'est@yahoo.ca',
    address: '658-8965 Placerat Ave',
    country: 'Belgium',
  },
  {
    name: 'Dennis Whitehead',
    phone: '(766) 189-9789',
    email: 'cursus.non@yahoo.ca',
    address: 'Ap #249-6096 Interdum. Rd.',
    country: 'South Africa',
  },
  {
    name: 'Burton Rodriquez',
    phone: '(271) 377-1289',
    email: 'dictum.sapien@aol.com',
    address: 'Ap #810-6158 Nulla. Street',
    country: 'Philippines',
  },
  {
    name: 'Timon Graham',
    phone: '(732) 689-8442',
    email: 'nullam@yahoo.couk',
    address: '4748 Non St.',
    country: 'Russian Federation',
  },
  {
    name: 'Cleo Ellis',
    phone: '(230) 985-3374',
    email: 'risus.morbi@protonmail.org',
    address: '719-9002 Fusce Ave',
    country: 'Singapore',
  },
  {
    name: 'Dustin Austin',
    phone: '(473) 642-1322',
    email: 'non.quam@protonmail.couk',
    address: 'Ap #496-410 Felis St.',
    country: 'Spain',
  },
  {
    name: 'Jolene Hood',
    phone: '1-295-706-1037',
    email: 'at@hotmail.org',
    address: '6949 Erat St.',
    country: 'South Africa',
  },
  {
    name: 'Karina Vaughan',
    phone: '(453) 301-2587',
    email: 'tristique.pellentesque.tellus@hotmail.edu',
    address: 'P.O. Box 380, 2816 Feugiat. St.',
    country: 'United Kingdom',
  },
  {
    name: 'Leroy Travis',
    phone: '(543) 788-0552',
    email: 'cursus.et.eros@aol.com',
    address: 'P.O. Box 905, 7727 Urna. St.',
    country: 'Brazil',
  },
  {
    name: 'Brianna Wilkinson',
    phone: '1-849-688-2236',
    email: 'posuere@icloud.ca',
    address: 'Ap #849-9951 Odio Avenue',
    country: 'Spain',
  },
  {
    name: 'Melvin Rivers',
    phone: '(784) 176-8664',
    email: 'erat.sed.nunc@google.org',
    address: 'Ap #862-294 Ultrices Avenue',
    country: 'Russian Federation',
  },
  {
    name: 'Yoshio Nash',
    phone: '(861) 627-1675',
    email: 'ut.tincidunt@hotmail.ca',
    address: '171-4794 Vestibulum Av.',
    country: 'France',
  },
  {
    name: 'Rebekah Tanner',
    phone: '1-815-308-1296',
    email: 'fames.ac.turpis@outlook.net',
    address: 'Ap #539-9967 Aliquam Rd.',
    country: 'Germany',
  },
  {
    name: 'Elmo Bennett',
    phone: '1-440-675-5666',
    email: 'ultrices.vivamus.rhoncus@yahoo.ca',
    address: '3331 Blandit Rd.',
    country: 'Poland',
  },
  {
    name: 'Zenaida Dale',
    phone: '1-723-514-2417',
    email: 'maecenas.iaculis@icloud.edu',
    address: '1306 Lectus Avenue',
    country: 'United States',
  },
  {
    name: 'Dacey Robles',
    phone: '1-638-755-6318',
    email: 'ullamcorper.magna@yahoo.org',
    address: '6258 Rutrum. Ave',
    country: 'Russian Federation',
  },
  {
    name: 'Cadman Hamilton',
    phone: '1-948-465-1254',
    email: 'feugiat.nec.diam@icloud.ca',
    address: '7377 Pharetra. Rd.',
    country: 'Vietnam',
  },
  {
    name: 'Ivor Bonner',
    phone: '(313) 779-6971',
    email: 'ipsum.cursus.vestibulum@yahoo.edu',
    address: 'P.O. Box 855, 3573 Aenean Rd.',
    country: 'Sweden',
  },
  {
    name: 'Madeson Sharpe',
    phone: '1-848-838-1229',
    email: 'sed.congue.elit@outlook.ca',
    address: '274-7312 Quisque Avenue',
    country: 'Italy',
  },
  {
    name: 'Kylynn Hicks',
    phone: '1-808-632-3147',
    email: 'velit.aliquam@icloud.net',
    address: 'P.O. Box 178, 7313 Vivamus Av.',
    country: 'India',
  },
  {
    name: 'Herman Buck',
    phone: '1-746-359-8792',
    email: 'amet@outlook.edu',
    address: '9422 Lorem Ave',
    country: 'Pakistan',
  },
  {
    name: 'Raymond Nixon',
    phone: '(365) 674-3050',
    email: 'sem.magna.nec@hotmail.edu',
    address: '796-3887 Integer Av.',
    country: 'Italy',
  },
  {
    name: 'Whitney Dickerson',
    phone: '1-477-875-6982',
    email: 'a@yahoo.com',
    address: 'Ap #836-5482 Quisque Ave',
    country: 'Germany',
  },
  {
    name: 'Bo Wilkinson',
    phone: '1-321-841-0234',
    email: 'dictum.sapien@icloud.org',
    address: 'Ap #655-3743 Mollis St.',
    country: 'South Korea',
  },
  {
    name: 'Jameson Mercado',
    phone: '1-578-531-2631',
    email: 'dolor@hotmail.ca',
    address: 'P.O. Box 941, 9059 Quam Street',
    country: 'Sweden',
  },
  {
    name: 'Nathaniel Duffy',
    phone: '1-214-278-5254',
    email: 'parturient.montes.nascetur@google.ca',
    address: '224-761 Adipiscing, Avenue',
    country: 'Canada',
  },
  {
    name: 'Ali Johns',
    phone: '1-130-675-8146',
    email: 'magnis.dis@protonmail.com',
    address: '8708 Varius Street',
    country: 'Russian Federation',
  },
  {
    name: 'Slade Larsen',
    phone: '1-680-101-2864',
    email: 'elementum.dui@aol.net',
    address: '780-9115 Tellus Avenue',
    country: 'Russian Federation',
  },
  {
    name: 'Hoyt Sexton',
    phone: '1-685-288-8401',
    email: 'consequat.auctor@outlook.com',
    address: '205-6937 Vitae, Av.',
    country: 'Italy',
  },
  {
    name: 'Rashad Hunter',
    phone: '(258) 593-9775',
    email: 'sagittis.nullam@icloud.couk',
    address: '601-3164 Sed Avenue',
    country: 'Vietnam',
  },
  {
    name: 'Maile Gallegos',
    phone: '1-647-510-4601',
    email: 'mattis.cras@google.couk',
    address: '198-540 Mauris Street',
    country: 'South Korea',
  },
  {
    name: 'Dennis Hooper',
    phone: '(724) 701-5833',
    email: 'donec.porttitor@google.org',
    address: '6656 Egestas Road',
    country: 'Nigeria',
  },
  {
    name: 'Catherine Battle',
    phone: '(423) 599-1284',
    email: 'non.nisi@outlook.edu',
    address: 'Ap #649-5799 Senectus St.',
    country: 'Sweden',
  },
  {
    name: 'Indira Weeks',
    phone: '1-623-561-2771',
    email: 'ut.quam@outlook.org',
    address: '511-1497 Dictum Rd.',
    country: 'Nigeria',
  },
  {
    name: 'Vladimir Bradford',
    phone: '(990) 494-1343',
    email: 'nonummy.ut.molestie@yahoo.org',
    address: '487-8612 Massa Avenue',
    country: 'Sweden',
  },
  {
    name: 'Evan Roth',
    phone: '(354) 399-5432',
    email: 'hymenaeos.mauris@google.org',
    address: 'P.O. Box 918, 8209 Donec Rd.',
    country: 'Poland',
  },
  {
    name: 'Melvin Sawyer',
    phone: '1-285-413-0367',
    email: 'sodales.elit@aol.com',
    address: 'Ap #315-5255 Arcu. Av.',
    country: 'Belgium',
  },
  {
    name: 'Barry Ware',
    phone: '(582) 470-1420',
    email: 'sit@protonmail.couk',
    address: '5819 Auctor Avenue',
    country: 'Costa Rica',
  },
  {
    name: 'Halla Pickett',
    phone: '(666) 554-0489',
    email: 'ac@aol.com',
    address: '6145 Varius St.',
    country: 'Ireland',
  },
  {
    name: 'Dorian Grimes',
    phone: '1-796-774-6031',
    email: 'est.vitae@icloud.couk',
    address: 'P.O. Box 811, 6809 Lorem Street',
    country: 'Peru',
  },
  {
    name: 'Rafael Deleon',
    phone: '1-253-606-7787',
    email: 'quis.lectus@aol.couk',
    address: 'P.O. Box 201, 2255 Orci. Road',
    country: 'Ukraine',
  },
  {
    name: 'Angelica Munoz',
    phone: '(724) 546-7823',
    email: 'magna.a.tortor@yahoo.ca',
    address: 'Ap #828-2114 Metus Ave',
    country: 'South Korea',
  },
  {
    name: 'Trevor Todd',
    phone: '(791) 753-5697',
    email: 'auctor.quis@icloud.couk',
    address: 'Ap #913-8028 Ridiculus St.',
    country: 'Pakistan',
  },
  {
    name: 'Cairo Peters',
    phone: '1-920-493-4217',
    email: 'nunc.quisque@hotmail.com',
    address: 'Ap #934-3864 Pede. St.',
    country: 'United States',
  },
  {
    name: 'Marah Simmons',
    phone: '(314) 654-5734',
    email: 'phasellus.libero@aol.net',
    address: 'P.O. Box 199, 5601 Ullamcorper Rd.',
    country: 'Singapore',
  },
  {
    name: 'Hakeem Strickland',
    phone: '(389) 700-7278',
    email: 'ullamcorper@protonmail.org',
    address: 'Ap #708-1005 Vulputate Av.',
    country: 'Pakistan',
  },
  {
    name: 'Hashim Robertson',
    phone: '(615) 441-7133',
    email: 'non@outlook.edu',
    address: '694-8455 Etiam Av.',
    country: 'Austria',
  },
  {
    name: 'Jolie Cohen',
    phone: '1-888-976-0168',
    email: 'aliquet.vel@aol.org',
    address: 'P.O. Box 617, 4900 Enim. Av.',
    country: 'Sweden',
  },
  {
    name: 'Sylvia Hawkins',
    phone: '(641) 747-9024',
    email: 'phasellus.elit@outlook.edu',
    address: 'P.O. Box 574, 3419 Ac Avenue',
    country: 'Chile',
  },
  {
    name: 'Amos Hunt',
    phone: '(484) 746-2952',
    email: 'auctor@icloud.net',
    address: '843-4499 Nec, St.',
    country: 'Indonesia',
  },
  {
    name: 'Elijah Ross',
    phone: '1-857-650-7245',
    email: 'lectus.convallis@outlook.net',
    address: 'Ap #130-3559 Hendrerit St.',
    country: 'India',
  },
  {
    name: 'Maya Lindsey',
    phone: '(869) 402-2572',
    email: 'tincidunt.nibh@google.net',
    address: '4620 Nisi St.',
    country: 'Mexico',
  },
  {
    name: 'Sonya Reeves',
    phone: '1-241-377-2316',
    email: 'conubia.nostra.per@protonmail.edu',
    address: '3461 Quam, St.',
    country: 'South Africa',
  },
  {
    name: 'Althea Delaney',
    phone: '(898) 561-4766',
    email: 'montes.nascetur@yahoo.org',
    address: 'Ap #324-8887 Elit. St.',
    country: 'Vietnam',
  },
  {
    name: 'Xaviera Ramos',
    phone: '1-668-414-0018',
    email: 'quis.tristique@protonmail.com',
    address: '679-5821 Mollis Av.',
    country: 'Spain',
  },
  {
    name: 'Robin Bullock',
    phone: '(873) 311-1694',
    email: 'placerat@icloud.edu',
    address: '138-9156 Vulputate, Street',
    country: 'Poland',
  },
  {
    name: 'Madonna Chavez',
    phone: '1-756-422-7718',
    email: 'dictum.eu@yahoo.org',
    address: 'P.O. Box 169, 5545 Nam St.',
    country: 'Austria',
  },
  {
    name: 'Chaney Mason',
    phone: '(848) 487-6461',
    email: 'vestibulum@hotmail.couk',
    address: 'Ap #544-9025 Egestas St.',
    country: 'Nigeria',
  },
  {
    name: 'Dai Vincent',
    phone: '1-792-679-4599',
    email: 'malesuada.integer@hotmail.net',
    address: 'Ap #827-1629 Sit Ave',
    country: 'United Kingdom',
  },
  {
    name: 'Porter Serrano',
    phone: '1-221-216-8046',
    email: 'sed.dui.fusce@aol.net',
    address: '759-4726 Lectus Rd.',
    country: 'Canada',
  },
  {
    name: 'Scott Norris',
    phone: '(253) 488-6431',
    email: 'curabitur.vel@protonmail.net',
    address: 'Ap #270-4585 Et, Street',
    country: 'United Kingdom',
  },
  {
    name: 'Lionel Summers',
    phone: '1-672-652-0857',
    email: 'cras.interdum@hotmail.org',
    address: '698-6932 Ornare Street',
    country: 'United States',
  },
  {
    name: 'Wayne Frye',
    phone: '(170) 925-6100',
    email: 'laoreet.lectus@aol.edu',
    address: '324 Semper Road',
    country: 'Belgium',
  },
  {
    name: 'Aurora Browning',
    phone: '1-724-516-3744',
    email: 'dis.parturient@protonmail.couk',
    address: 'Ap #141-4399 Eu, Street',
    country: 'Turkey',
  },
  {
    name: 'Amity Nixon',
    phone: '(361) 228-5828',
    email: 'at.velit@protonmail.edu',
    address: '713-8931 Eu Rd.',
    country: 'South Korea',
  },
  {
    name: 'Jarrod Dickerson',
    phone: '(325) 981-1947',
    email: 'turpis@icloud.ca',
    address: '698-8054 Aliquam Avenue',
    country: 'Pakistan',
  },
  {
    name: 'Neve Byrd',
    phone: '(753) 849-5759',
    email: 'libero.morbi@hotmail.net',
    address: '4200 Natoque Ave',
    country: 'South Korea',
  },
  {
    name: 'Dante Clemons',
    phone: '1-232-267-0255',
    email: 'viverra@yahoo.ca',
    address: 'Ap #120-8439 Ac Avenue',
    country: 'India',
  },
  {
    name: 'Lael Hardin',
    phone: '(744) 182-8234',
    email: 'velit.pellentesque@outlook.net',
    address: '853-6650 Ipsum Avenue',
    country: 'Peru',
  },
  {
    name: 'Dominic Downs',
    phone: '1-803-839-2901',
    email: 'dignissim.pharetra@protonmail.net',
    address: 'Ap #773-4896 Blandit Rd.',
    country: 'Costa Rica',
  },
  {
    name: 'Yasir Hartman',
    phone: '1-514-498-7633',
    email: 'felis@google.net',
    address: 'Ap #328-4326 Primis Av.',
    country: 'Italy',
  },
  {
    name: 'Iona Lowe',
    phone: '(314) 857-9363',
    email: 'eu.erat@yahoo.ca',
    address: '9636 Duis St.',
    country: 'India',
  },
  {
    name: 'Francis Hays',
    phone: '(142) 555-2665',
    email: 'mauris.sapien@aol.org',
    address: 'P.O. Box 314, 3095 Ullamcorper Avenue',
    country: 'Ukraine',
  },
  {
    name: 'Reese Pacheco',
    phone: '1-316-488-5828',
    email: 'tincidunt.adipiscing.mauris@icloud.net',
    address: 'P.O. Box 998, 6215 Non, Rd.',
    country: 'Canada',
  },
  {
    name: 'Miriam Fowler',
    phone: '(937) 256-0468',
    email: 'in.faucibus.morbi@yahoo.org',
    address: '3452 Non St.',
    country: 'Singapore',
  },
  {
    name: 'August Carey',
    phone: '1-268-277-6517',
    email: 'dictum.placerat.augue@outlook.net',
    address: 'P.O. Box 742, 3944 Eleifend Avenue',
    country: 'Pakistan',
  },
  {
    name: 'Ayanna Nichols',
    phone: '(284) 135-7245',
    email: 'iaculis.quis@aol.ca',
    address: '296-2243 Posuere Rd.',
    country: 'France',
  },
  {
    name: 'Scarlet Newton',
    phone: '(785) 662-7247',
    email: 'nec.tempus@aol.org',
    address: '782-9613 Varius Rd.',
    country: 'Canada',
  },
  {
    name: 'Caleb Vaughan',
    phone: '1-541-854-7132',
    email: 'justo.eu@outlook.com',
    address: '320-908 Sed, Street',
    country: 'Costa Rica',
  },
  {
    name: 'Jael Ray',
    phone: '(431) 448-1989',
    email: 'sed.dolor.fusce@yahoo.couk',
    address: '170-9147 Ut Av.',
    country: 'Mexico',
  },
  {
    name: 'Lucius Richardson',
    phone: '(844) 766-7833',
    email: 'magna.et.ipsum@protonmail.ca',
    address: 'Ap #102-7980 Luctus St.',
    country: 'Netherlands',
  },
  {
    name: 'Allegra Kemp',
    phone: '1-261-969-2777',
    email: 'eu.eros.nam@google.com',
    address: 'Ap #512-2365 Sapien. Av.',
    country: 'United Kingdom',
  },
  {
    name: 'Kerry Hebert',
    phone: '1-367-954-5734',
    email: 'dui.nec@yahoo.ca',
    address: '636-2230 Ac Rd.',
    country: 'Nigeria',
  },
  {
    name: 'Shoshana Serrano',
    phone: '(610) 432-3242',
    email: 'duis.risus.odio@aol.ca',
    address: 'Ap #191-9385 Nisi Street',
    country: 'France',
  },
  {
    name: 'Basia Morton',
    phone: '1-956-528-1477',
    email: 'enim@protonmail.org',
    address: 'P.O. Box 113, 773 Quisque Avenue',
    country: 'Australia',
  },
  {
    name: 'Raven Barton',
    phone: '(728) 784-8797',
    email: 'vel.arcu.curabitur@icloud.couk',
    address: 'Ap #269-6600 Sagittis Street',
    country: 'New Zealand',
  },
  {
    name: 'Noble Barron',
    phone: '1-622-381-3086',
    email: 'tempus.non.lacinia@aol.ca',
    address: 'Ap #602-4128 Nec, St.',
    country: 'New Zealand',
  },
  {
    name: 'Evelyn Salazar',
    phone: '(966) 381-4777',
    email: 'ornare.libero@yahoo.com',
    address: 'Ap #919-1625 Ut Road',
    country: 'Canada',
  },
  {
    name: 'Montana Lindsey',
    phone: '1-939-387-1378',
    email: 'vel@google.ca',
    address: 'P.O. Box 699, 4192 Imperdiet Road',
    country: 'Pakistan',
  },
  {
    name: 'Renee Ortega',
    phone: '1-583-214-7758',
    email: 'sed.malesuada@outlook.com',
    address: 'Ap #195-1935 Inceptos Street',
    country: 'Costa Rica',
  },
  {
    name: 'Gavin Mendez',
    phone: '(784) 812-7462',
    email: 'non@aol.couk',
    address: 'P.O. Box 356, 2656 Sit Road',
    country: 'Philippines',
  },
  {
    name: 'Troy Velazquez',
    phone: '1-415-515-3773',
    email: 'libero.nec@hotmail.edu',
    address: '6106 Quam, Road',
    country: 'New Zealand',
  },
  {
    name: 'Megan Hopper',
    phone: '1-793-666-8853',
    email: 'turpis.vitae.purus@google.couk',
    address: '7563 Leo Street',
    country: 'Philippines',
  },
];

function getRandomNumberBetween(min: number, max: number) {
  return Math.random() * (max - min + 1) + min;
}

// ! CONDITION: test data items must have consistent number of keys
const COLS_NUM = Object.keys(testData[0]).length;

export default function App() {
  const headerOffsetX = useRef(new Animated.Value(0)).current;
  const freezeColOffsetY = useRef(new Animated.Value(0)).current;

  const HeaderRow = ({ hidden }: { hidden: boolean }) => {
    const headerCells: any = [];

    headerCells.push(
      <Text
        style={{
          borderWidth: 1,
          width: 100,
          padding: 10,
          opacity: 0,
          display: hidden ? 'flex' : 'none',
        }}
        key={`HEADER HOLDER NHA`}
      ></Text>
    );

    for (let i = 0; i < COLS_NUM; i++) {
      headerCells.push(
        <Text
          style={{
            borderWidth: 1,
            width: 175,
            padding: 10,
            backgroundColor: 'lime',
            fontWeight: 'bold',
          }}
          key={`HEADER ${i}`}
        >
          {Object.keys(testData[0])[i].toUpperCase()}
        </Text>
      );
    }
    return (
      <Animated.View
        style={[
          styles.box,
          {
            transform: [
              {
                translateX: Animated.multiply(
                  headerOffsetX,
                  new Animated.Value(-1)
                ),
              },
            ],
          },
        ]}
      >
        {headerCells}
      </Animated.View>
    );
  };

  const DataRow = ({
    dataItem,
    rowOrder,
    hidden,
  }: {
    dataItem: any;
    rowOrder: number;
    hidden?: boolean;
  }) => {
    const dataRowContainer: any = [];
    dataRowContainer.push(
      <Text
        style={{
          borderWidth: 1,
          width: 100,
          backgroundColor: 'lightpink',
          textAlign: 'center',
          padding: 10,
          display: hidden ? 'flex' : 'none',
        }}
        key={getRandomNumberBetween(1, 1000)}
      >
        {rowOrder + 1}
      </Text>
    );

    Object.keys(dataItem).forEach((key) => {
      dataRowContainer.push(
        <Text
          style={{
            borderWidth: 1,
            width: 175,
            backgroundColor: 'violet',
            textAlign: 'center',
            padding: 10,
            opacity: hidden ? 0 : 1,
          }}
          key={getRandomNumberBetween(1000, 2000)}
        >
          {dataItem[key]}
        </Text>
      );
    });

    return <View style={{ flexDirection: 'row' }}>{dataRowContainer}</View>;
  };

  // create data row elements container
  const dataRows: any = [];
  const dataRows2: any = [];
  testData.map((item, idx) => {
    dataRows.push(
      <DataRow
        key={getRandomNumberBetween(2000, 3000)}
        dataItem={item}
        rowOrder={idx}
        hidden={false}
      />
    );

    dataRows2.push(
      <DataRow
        key={getRandomNumberBetween(2000, 3000)}
        dataItem={item}
        rowOrder={idx}
        hidden={true}
      />
    );
  });

  return (
    <View style={styles.container2}>
      <Animated.View
        style={[
          styles.container3,
          {
            transform: [
              {
                translateY: Animated.multiply(
                  freezeColOffsetY,
                  new Animated.Value(-1)
                ),
              },
            ],
          },
        ]}
      >
        <ScrollView
          bounces={false}
          scrollEventThrottle={16}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          <ScrollView
            style={{ paddingBottom: 16 }} // ! TO SCROLL VERTICALLY COMPLETELY
            bounces={false}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
          >
            {dataRows2}
          </ScrollView>
        </ScrollView>

        <HeaderRow hidden />
      </Animated.View>

      <View style={styles.container}>
        <ScrollView
          bounces={false}
          scrollEventThrottle={16}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: headerOffsetX,
                  },
                },
              },
            ],
            { useNativeDriver: false }
          )}
        >
          <ScrollView
            style={{ paddingBottom: 16 }} // ! TO SCROLL VERTICALLY COMPLETELY
            bounces={false}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      y: freezeColOffsetY,
                    },
                  },
                },
              ],
              { useNativeDriver: false }
            )}
          >
            {dataRows}
          </ScrollView>
        </ScrollView>

        <HeaderRow hidden={false} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column-reverse',
    marginLeft: 100,
  },
  container2: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 40,
    overflow: 'hidden',
  },
  container3: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column-reverse',
    position: 'absolute',
  },
  box: {
    flexDirection: 'row',
  },
  box2: {
    flexDirection: 'column',
  },
});
