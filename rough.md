## Deactivate












# Deactivate
user.active = False
db.session.commit()

# Reactivate
user.active = True
db.session.commit()


or 


# Deactivate
security.datastore.deactivate_user(user)
db.session.commit()

# Reactivate
security.datastore.activate_user(user)
db.session.commit()