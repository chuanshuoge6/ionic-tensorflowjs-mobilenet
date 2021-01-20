import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs'
import imagenet_label from './imagenet_label.json'
import '../pages/Home.css';
import domtoimage from 'dom-to-image';

export default function MobileNet(props) {
    const [model, setModel] = useState(null)
    const [model_predictions, setModel_predictions] = useState(null)

    useEffect(() => { loadModel() }, [props.predict]);

    const loadModel = async () => {
        const m = await tf.loadLayersModel('/assets/model.json')
        setModel(m)

        if (props.predict > 0) {
            setModel_predictions(null)

            //convert media to png before processing image
            domtoimage.toPng(props.image)
                .then(function (dataUrl) {
                    var img = new Image();
                    img.src = dataUrl;

                    //wait for new png image
                    var timer = setInterval(function () {
                        if (img.src) {
                            processImage(img)
                            clearInterval(timer)
                        }
                    }, 100)

                })
                .catch(function (error) {
                    alert("error converting image to png");
                });
        }
    }

    const processImage = async (image) => {
        const pixels = tf.browser.fromPixels(image).resizeNearestNeighbor([224, 224]).toFloat()
        const offset = tf.scalar(127.5)
        const preprocessed_image = pixels.sub(offset).div(offset).expandDims()

        const predictions = await model.predict(preprocessed_image).data()

        //predictions is Float32Array(1000), find top5 value with their index
        let top5 = []

        for (let i = 0; i < 5; i++) {
            const imax = predictions.indexOf(Math.max(...predictions));

            const key = imagenet_label[imax.toString()]
            const value = predictions[imax].toExponential(2).toString()

            top5.push(<tr key={key}>
                <td>{key}</td>
                <td>{value}</td>
            </tr>)

            predictions[imax] = 0
        }

        /*top5
        Array(5)       ​
            0: Object { "bald eagle, American eagle, Haliaeetus leucocephalus": "9.60e-1" }
            1: Object { kite: "3.93e-2" }
            2: Object { "black grouse": "9.76e-5" }
            3: Object { vulture: "8.26e-5" }
            4: Object { "black stork, Ciconia nigra": "7.81e-5" }
        */

        setModel_predictions(top5)
    }

    return (
        <div>
            {props.predict > 0 && !model_predictions ? <span>Calculating...</span> : null}
            {model_predictions ?
                <table>
                    <thead><tr><th>Object</th><th>Probability</th></tr></thead>
                    <tbody>{model_predictions}</tbody>
                </table> : null}
        </div>
    )
}