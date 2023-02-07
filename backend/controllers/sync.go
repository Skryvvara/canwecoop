package controllers

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/skryvvara/canwecoop/middleware"
	"github.com/skryvvara/canwecoop/utils"
)

func StartSync(w http.ResponseWriter, r *http.Request) {
	user, err := middleware.GetUserFromContext(r)
	if err != nil {
		log.Println(err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	if utils.PROCESS_LOCKED {
		msg := "Can not start sync process, another sync process is already running."
		log.Println(msg)
		http.Error(w, msg, http.StatusConflict)
		return
	}

	if time.Since(utils.LAST_SYNC) <= utils.COOLDOWN {
		msg := "Last sync was too recent, cannot start new sync process. Last sync was at: " + utils.LAST_SYNC.Format(time.RFC3339)
		log.Println(msg)
		http.Error(w, msg, http.StatusConflict)
		return
	}

	go utils.SyncGames()

	msg := fmt.Sprintf("Sync process was manually started. Started by: %s (%s)", user.DisplayName, user.ID)
	log.Println(msg)
	w.WriteHeader(http.StatusAccepted)
	w.Write([]byte(msg))
}
