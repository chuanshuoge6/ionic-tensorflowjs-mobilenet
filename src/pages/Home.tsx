import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
  IonItem, IonIcon, IonLabel, IonButton, IonInput
} from '@ionic/react';
import React, { useState } from 'react';
import './Home.css';
import MobileNet from '../components/tensorflow_mobileNet'

const Home: React.FC = () => {
  const [predictClick, setPredictClick] = useState(0);
  const [imageUrl, setImageUrl] = useState('https://images.theconversation.com/files/308043/original/file-20191220-11924-iakhpb.jpeg?ixlib=rb-1.1.0&q=45&auto=format&w=754&fit=clip')

  const browseImg = (e: any) => {
    const fileURL = URL.createObjectURL(e.target.files[0])
    //get url where uploaded image is temporarily stored
    //blob:http://localhost:3000/11c28a94-d9df-43e1-ab6c-2185e1449eb6
    setImageUrl(fileURL)
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            Predict Image with MobileNet
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              MobileNet Input Image
              </IonCardTitle>
          </IonCardHeader>
          <IonItem lines="none">
            <IonButton fill="outline"
              onClick={() => document.getElementById('input-image-browser')?.click()}>
              Browse Local Image</IonButton>
            <input hidden type="file" accept="image/*" id="input-image-browser"
              onChange={(e) => browseImg(e)}></input>
          </IonItem>
          <IonItem >
            <IonLabel slot="start">Paste Web Image URL</IonLabel>
            <IonInput type="url" placeholder="https://image.com/image.jpg"
              onIonChange={(e) => setImageUrl(e.detail.value!)}></IonInput>
          </IonItem>
          <IonItem lines="none">
            <img id='test_image' src={imageUrl} alt="Input Image"></img>
          </IonItem>
          <IonItem lines="none">
            <IonButton fill="outline" onClick={() => setPredictClick(predictClick + 1)}>Predict</IonButton>
          </IonItem>
          <IonCardHeader>
            <IonCardTitle>
              MobileNet Prediction Result
              </IonCardTitle>
          </IonCardHeader>
          <IonItem lines="none">
            <MobileNet image={document.getElementById('test_image')} predict={predictClick} />
          </IonItem>
        </IonCard>

      </IonContent>
    </IonPage>
  );
};

export default Home;
