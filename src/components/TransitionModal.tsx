import React, { Dispatch, FC, Fragment, SetStateAction, useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { Button, Slide } from "@mui/material";
import { IMarker } from "./Marker";
import { useWeb3React } from "@web3-react/core";

const style = {
  position: "absolute",
  width: "100%",
  height: "30%",
  bottom: 0,
  bgcolor: "#04161F",
  border: "2px solid #000",
  boxShadow: 24,
  px: 2,
  pb: 5,
};

interface Props {
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
  marker: IMarker | null;
}

const TransitionModal: FC<Props> = ({ setOpen, open, marker }) => {
  const handleClose = () => setOpen(false);
  const handleClick = (claim: string) => {
    const claimed = claim !== "Unclaimed";
    const link = claimed
      ? "https://projectolympus.8thwall.app/hack-house/start"
      : "https://projectolympus.8thwall.app/hack-house/start/claim";
    

    signMessage(link);
   
    
  };

  const [signature, setSignature] = useState("");
  const [signedMessage, setSignedMessage] = useState("");
  const [message, setMessage] = useState("Verify location interaction");
  const [error, setError] = useState("");
  const { library,activate, deactivate } = useWeb3React();
  const { account } = useWeb3React();

  const signMessage = async (link: string) => {
    
    try {
      const signature = await library.provider.request({
        method: "personal_sign",
        params: [message, account]
      });
      setSignedMessage(message);
      setSignature(signature);
      setTimeout(()=>{
        window.open(link, "_blank");
      },1500)
      
    } catch (error) {
      // setError(error);
    }
  };

  // useEffect(()=>{
   
  // }, [signature])

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Slide in={open} direction={"up"} mountOnEnter unmountOnExit>
        <Box sx={style} alignItems="center" justifyContent="center">
          <Typography id="transition-modal-description" sx={{ mt: 2 }}>
            {marker ? (
              <Fragment>
                <h2 style={{ color: "white" }}>{marker.title}</h2>
                <h3 style={{ color: "#56cfe1" }}>{marker.claim}</h3>
                <p style={{ color: "#fe0708" }}>{marker.health}</p>
                <p style={{ color: "#7851DF" }}>{marker.streak}</p>
                <Button
                  variant="contained"
                  onClick={() => handleClick(marker.claim)}
                >
                  {signature ? "Transaction Verified" : marker.button}
                </Button>
              </Fragment>
            ) : null}
          </Typography>
        </Box>
      </Slide>
    </Modal>
  );
};

export default TransitionModal;
