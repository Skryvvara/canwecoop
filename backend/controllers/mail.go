package controllers

import (
	"crypto/tls"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/skryvvara/canwecoop/config"
	"gopkg.in/gomail.v2"
)

type MailProperties struct {
	HoneyPot string `json:"honey"`
}

type MailRequest struct {
	Sender     string         `json:"sender"`
	Subject    string         `json:"subject"`
	Message    string         `json:"message"`
	Properties MailProperties `json:"properties"`
}

func SendMail(w http.ResponseWriter, r *http.Request) {
	var mailRequest MailRequest
	if err := json.NewDecoder(r.Body).Decode(&mailRequest); err != nil {
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		log.Println(err)
		return
	}

	for _, value := range []string{mailRequest.Message, mailRequest.Sender, mailRequest.Subject} {
		if value == "" {
			http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
			log.Println("One ore more fields in the mail request were empty, got ", mailRequest)
			return
		}
	}

	if mailRequest.Properties.HoneyPot != "" {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	host := config.APP.Mail.Host
	port := config.APP.Mail.Port
	user := config.APP.Mail.Username
	password := config.APP.Mail.Password
	from := config.APP.Mail.From
	to := config.APP.Mail.To

	message := fmt.Sprintf(`
	<body>
		<h1>New message from %s:</h1>
		<h2>%s</h2>
		<p>%s</p>
	</body>`,
		mailRequest.Sender, mailRequest.Subject, mailRequest.Message)

	m := gomail.NewMessage()
	m.SetAddressHeader("From", user, from)
	m.SetHeader("To", to)
	m.SetHeader("Subject", mailRequest.Subject)
	m.SetBody("text/html", message)

	d := gomail.NewDialer(host, port, user, password)
	d.SSL = config.APP.Mail.UseSSL
	d.TLSConfig = &tls.Config{InsecureSkipVerify: !config.APP.Mail.UseTLS}

	if err := d.DialAndSend(m); err != nil {
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
}
