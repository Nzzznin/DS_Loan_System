SELECT i.ID FROM installment i INNER JOIN client c ON i.client_id = c.ID  WHERE i.status = 0 AND c.national_code = $1;
