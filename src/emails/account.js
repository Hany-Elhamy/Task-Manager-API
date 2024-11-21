const sgMail=require("@sendgrid/mail")
sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const sendWelcomeEmail=(email,name)=>{
    sgMail.send({
    to:email,
    from:"hanyelhamy123@gmail.com",
    subject:"Welcome Email",
    text:`Welcome to the task app, ${name}. Let me know how you get along with the app`
})}

const sendCancelationEmail=(email,name)=>{
sgMail.send({
    to:email,
    from:"hanyelhamy123@gmail.com",
    subject:"Cancelation Mail",
    text:`Hi ${name}, We noticed that you've recently deleted your account with us, and we're sorry to see you go. Your experience is incredibly important to us, and we would love to understand what went wrong.`
})
}

module.exports={
    sendWelcomeEmail,
    sendCancelationEmail
}