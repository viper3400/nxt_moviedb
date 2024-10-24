import './App.css';
import { useQuery, gql } from '@apollo/client';

function App() {
  return (
    <div className="App">
      <div>
        <h2>My first Apollo app 🚀</h2>
        <br/>
         <DisplayLocations />
      </div>
    </div>
  );
}

const GET_LOCATIONS = gql`
  query MyQuery {
    videos(genreName: "Comedy") {
      title
      diskid
      genres
      subtitle
      mediaType
      id
    }
  }
`;

function DisplayLocations() {

  const { loading, error, data } = useQuery(GET_LOCATIONS);


  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error : {error.message}</p>;


  return data.videos.map(({ id, title, diskid, subtitle  }) => (

    <div key={id}>

      <h3>{title}</h3>

      <h2>{diskid}</h2>

      <br />

      <b>About this location:</b>

      <p>{subtitle}</p>

      <br />

    </div>

  ));

}
export default App;
