"use client";
import Gijildo from "@/components/tests/Gijildo";
export default function GijildoPage() {
  return (
    <Gijildo
      onClose={()=>{if(typeof window!=="undefined"){window.location.href="/";}}}
      selectedPerson={null}
      addHistory={()=>{}}
      cart={[]}
      setCart={()=>{}}
      onGoShop={()=>{if(typeof window!=="undefined")window.location.href="/?tab=goods";}}
      onOpenService={(sid:string)=>{if(typeof window!=="undefined")window.location.href=`/?svc=${sid}`;}}
      isLoggedIn={false}
      onLoginRequest={()=>{if(typeof window!=="undefined")window.location.href="/?login=1";}}
      onRequestPerson={()=>{if(typeof window!=="undefined")window.location.href="/?tab=my";}}
    />
  );
}
